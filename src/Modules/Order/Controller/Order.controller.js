import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
import moment from "moment";
import cartModel from "../../../../DB/model/Cart.model.js";
import { createInvoice } from "../../../Services/pdf.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { response } from "express";

export const createOrder = async (req, res, next) => {
  const { products, address, phoneNumber, couponName, paymentType } = req.body;
  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName.toLowerCase() });
    if (!coupon)
      return next(
        new Error(`no coupon found with the name '${couponName}'`, {
          cause: 404,
        })
      );
      
      const now = moment();
      const parsed = moment(coupon.expireDate, "DD/MM/YYYY");
      const diff = now.diff(parsed, "days");
      
      // return res.json("hi")
      if (diff >= 0) return next(new Error("coupon expired", { cause: 400 }));
      if (coupon.usedBy.indexOf(req.user._id) != -1) {
        return next(
          new Error(`coupon already used by ${req.user._id}`, { cause: 400 })
          );
        }
        req.body.coupon = coupon;
      }
  const finalProductList = [];
  const productIds = [];
  let subTotal = 0;
  for(let i = 0; i < products.length; ++i) {
    // return res.json(products[i])
    const checkProduct = await productModel.findOne({_id:products[i].productId, isDeleted:false, stock:{$gte:products[i].qty}});
    if(!checkProduct){
      return next(new Error(`invalid product ${products[i].productId}`, {cause:400}));
    }
    products[i].unitPrice = checkProduct.price;
    products[i].finalPrice = checkProduct.finalPrice;
    products[i].name = checkProduct.name;
    subTotal += products[i].finalPrice;
    finalProductList.push(products[i]);
    productIds.push(products[i].productId);
  }

  const order = await orderModel.create({
    userId:req.user._id,
    address,
    phoneNumber,
    products:finalProductList,
    subTotal,
    couponId:req.body.coupon?._id,
    paymentType,
    finalPrice:subTotal - (subTotal * (req.body.coupon?.amount || 0)/100),
    status:paymentType === 'Visa'? 'approved' : 'pending',
  });
  
  for(let i = 0; i < products.length; i++){
    // return res.json(products[i])
    await productModel.updateOne({_id: products[i].productId}, {$inc:{stock:(-products[i].qty)}})
  }

  if(req.body.coupon){
    await couponModel.findOneAndUpdate({name:couponName}, {$addToSet:{usedBy:req.user._id}});
  }

  await cartModel.updateOne({userId:req.user._id}, {$pull:{
    products:{
      productId:{$in:productIds}
    }
  }})
  
  const invoice = {
    shipping: {
      name: req.user.userName,
      address,
      // city: "San Francisco",
      // state: "CA",
      country: "Palestine",
      // postal_code: 94111
    },
    items: order.products,
    subtotal:order.subTotal,
    total: order.finalPrice,
    invoice_nr: order._id
  };
  
  createInvoice(invoice, "invoice.pdf");
  
  await sendEmail(req.user.email, 'invoice ecommerce3', 'congrats, your order has been created', {path:'invoice.pdf', contentType:'application/pdf' });
  return res.status(201).json({message:'success', order});


};

export const createOrderWithAllItemsFromCart = async (req, res, next) => {
  const { address, phoneNumber, couponName, paymentType } = req.body;

  const cart = await cartModel.findOne({userId:req.user._id});

  if(!cart?.products?.length){
    return next(new Error('empty cart!', {cause:400}));
  }
  const { products } = cart.products;
  if (couponName) {
    const coupon = await couponModel.find({ name: couponName.toLowerCase() });
    if (!coupon)
      return next(
        new Error(`no coupon found with the name '${couponName}'`, {
          cause: 404,
        })
      );

    const now = moment();
    const parsed = moment(coupon.expireDate, "DD/MM/YYYY");
    const diff = now.diff(parsed, "days");

    if (diff >= 0) return next(new Error("coupon expired", { cause: 400 }));

    if (coupon.usedBy.includes(req.user._id)) {
      return next(
        new Error(`coupon already used by ${req.user._id}`, { cause: 400 })
      );
    }
      req.body.coupon = coupon;
  }
  // return res.json("hi")
  const finalProductList = [];
  const productIds = [];
  let subTotal = 0;
  for(const product in products) {
    const checkProduct = await productModel.findOne({_id:product.productId, isDeleted:false, stock:{$gte:product.qty}});
    if(!checkProduct){
      return next(new Error(`invalid product ${product.productId}`, {cause:400}));
    }
    product.unitPrice = checkProduct.price;
    product.finalPrice = checkProduct.finalPrice;
    product.name = checkProduct.name;
    subTotal += product.finalPrice;
    finalProductList.push(product);
    productIds.push(product.productId);
  }
  
  const order = await orderModel.create({
    userId:req.user._id,
    address,
    phoneNumber,
    products:finalProductList,
    subTotal:subTotal,
    couponId:req.body.coupon?._id,
    paymentType,
    finalPrice:subTotal - (subTotal * (req.body.coupon?.amount || 0)/100),
    status:paymentType === 'Visa'? 'approved' : 'pending',
  });


  for(const product in products){
    await productModel.updateOne({_id: product.productId}, {$inc:{stock:-product.qty}})
  }

  if(req.body.coupon){
    await couponModel.updateOne({name:couponName}, {$addToSet:{usedBy:req.user._id}});
  }

  await cartModel.updateOne({userId:req.user._id}, { products:[] })
 const invoice = {
    shipping: {
      name: req.user.userName,
      address,
      // city: "San Francisco",
      // state: "CA",
      country: "Palestine",
      // postal_code: 94111
    },
    items: order.products,
    subtotal:order.subTotal,
    total: order.finalPrice,
    invoice_nr: order._id
  };
  
  createInvoice(invoice, "invoice.pdf");
  
  await sendEmail(req.user.email, 'invoice ecommerce3', 'congrats, your order has been created', {path:'invoice.pdf', contentType:'application/pdf' });
  return res.status(201).json({message:'success', order});


};

export const cancelOrder = async (req,res, next) => {
  const {orderId} = req.params;
  const {cancelReason} = req.body;
  const order = await orderModel.findOne({_id: orderId, userId:req.user._id});
  if(!order || (order.status != 'pending' && order.paymentType == 'Cash') || order.paymentType != 'Cash' ) {
    return next(new Error(`can't cancel this order`, {cause:400}));
  }

  await orderModel.updateOne({_id:orderId}, {status:"cancelled", cancelReason, updatedBy:req.user._id});
  for(const product of order.products) {
    await productModel.updateOne({_id:product.productId}, {$inc:{stock:product.qty}})
  }

  if(order.couponId){
    await couponModel.updateOne({_id:order.couponId}, {$pull:{usedBy:req.user._id}})
  }
  return res.status(200).json({message:'success'});
}

export const changeStatusFromAdmin = async (req, res, next) => {
  const {orderId} = req.params;
  const {status} = req.body;

  const order = await orderModel.findOne({_id:orderId});
  if(!order ){
    return next(new Error(`this order was not found`, {cause:404}))
  }
  if(order.status=='delivered' || order.status == 'cancelled'){
    return next(new Error(`order status is ${order.status}`, {cause:400}));
  }

  const updatedOrder = await orderModel.findOneAndUpdate({_id:orderId}, {status}, {new:true});
  if(!updatedOrder){
    return next(new Error('fail to change status!', {cause:400}))
  }
  return res.status(200).json({message:'success', order:updatedOrder});
}





































////////////////////////////

export const updateOrder = async (req, res, next) => {
  const order = await orderModel.findById(req.params.catId);
  if (!order)
    return next(
      new Error(`invalid order id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (order.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await orderModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate order name`, { cause: 409 }));

    order.name = req.body.name;
    order.slug = slugify(req.body.name);
  }

  if (req.body.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.oath,
      { folder: `${process.env.APP_NAME}/order` }
    );
    await cloudinary.uploader.destroy(order.image.public_id);
    order.image = { secure_url, public_id };
  }
  order.updatedBy = req.user._id;
  await order.save();
  return res.status(200).json({ message: "success", order });
};

export const getSpecificOrder = async (req, res, next) => {
  const order = await orderModel.findById(req.params.catId);
  if (!order) return res.status(404).json({ message: "no order found" });
  return res.status(200).json({ message: "success", order });
};
export const getOrder = async (req, res, next) => {
  const orders = await orderModel.find();

  return res.status(200).json({ message: "success", orders });
};

