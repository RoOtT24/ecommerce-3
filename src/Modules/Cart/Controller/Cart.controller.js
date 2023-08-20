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


export const removeItem = async (req, res, next) => {
  const {productId} = req.params;
  const cart = await cartModel.updateOne({userId: req.user._id}, {$pull:{products:{productId:{$in:productId}}}});
  if(!cart.matchedCount)
    return next(new Error('no products to remove', {cause:400}));
  return res.status(200).json({message:'success', cart})
  
}


export const clearCart = async (req, res, next) => {
  await cartModel.updateOne({userId: req.user._id}, {products: []});
  return res.status(200).json({message:'success'});
}


export const getSpecificCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId:req.user._id });
  if (!cart) 
    return next(new Error("no cart found", {cause:404} ));
  return res.status(200).json({ message: "success", cart });
};

export const getAllCarts = async (req, res, next) => {
  const carts = await cartModel.find();

  return res.status(200).json({ message: "success", carts });
};

