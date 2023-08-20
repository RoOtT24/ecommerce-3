import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createReview = async (req, res, next) => {
  const { productId } = req.params;
  const {comment , rating} = req.body;
  const order = await orderModel.findOne({userId: req.user._id, status:'delivered', 'products.productId': productId})
  
  if(!order){
    return next(new Error(`no product to review!`, {cause:404}))
  }

  const checkReview = await reviewModel.findOne({createdBy: req.user._id, productId});
  if(checkReview){
    return next(new Error(`can not review this product again`, {cause:400}));
  }

  const review = await reviewModel.create({createdBy:req.user._id, orderId:order._id, productId, comment, rating})

  return res.status(201).json({ message: "success", review });
};

export const updateReview = async (req, res, next) => {
  const {productId, reviewId} = req.params;
  const review = await reviewModel.findOneAndUpdate({_id: reviewId, productId}, req.body, {new:true})
  return res.status(200).json({ message: "success", review });
}


export const getSpecificReview = async (req, res, next) => {
  const review = await reviewModel.findById(req.params.catId);
  if(!review)
    return res.status(404).json({ message: "no review found"});
  return res.status(200).json({message:"success", review});
}
export const getReview = async (req, res, next) => {
  const categories = await reviewModel.find();
  
  return res.status(200).json({message:"success", categories});
}