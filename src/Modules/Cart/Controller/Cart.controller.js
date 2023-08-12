import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const addProductToCart = async (req, res, next) => {
  const { qty, productId } = req.body;
 
  const product = productModel.findById(productId);
  if(!product)
    return next(new Error('no product found', {cause:404}));
  else if(product.stock < qty){
    return next(new Error('invalid product quantity', {cause:400}));
  }
  const cart = await cartModel.findOne({userId:req.user._id});
  if(!cart){
    const newCart = await cartModel.create ({
      userId:req.user._id, products:{productId, qty}
    });
    return res.status(201).json({ message: "success", cart:newCart });
  }
  let matchProducts = false;
  for(const product of cart.products){
    if(product.productId.toString() === productId){
      product.qty = qty; 
      matchProducts = true;
      break;
    }
  }
  if(!matchProducts){
    cart.products.push({productId, qty});
  }
  await cart.save();
  return res.status(200).json({ message: "success", cart});
};

export const updateCart = async (req, res, next) => {
  const { cartId, catId } = req.params;
  const cart = await cartModel.findOne({ _id: cartId, categoryId: catId });
  if (!cart)
    return next(
      new Error(`invalid cart id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (cart.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await cartModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate cart name`, { cause: 409 }));

    cart.name = req.body.name;
  }

  if (req.body.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.oath,
      { folder: `${process.env.APP_NAME}/cart` }
    );
    await cloudinary.uploader.destroy(cart.image.public_id);
    cart.image = { secure_url, public_id };
  }
  cart.updatedBy = req.user._id;
  await cart.save();
  return res.status(200).json({ message: "success", cart });
};

export const getSpecificCart = async (req, res, next) => {
  const { catId, cartId } = req.params;
  const cart = await cartModel.findOne({ categoryId: catId, _id: cartId });
  if (!cart) return res.status(404).json({ message: "no cart found" });
  return res.status(200).json({ message: "success", cart });
};

export const getAllCarts = async (req, res, next) => {
  const categories = await cartModel.find();

  return res.status(200).json({ message: "success", categories });
};

export const getCartsInCat = async (req, res, next) => {
  const { catId } = req.params;
  const carts = await cartModel.find({ categoryId: catId });

  return res.status(200).json({ message: "success", carts });
};
