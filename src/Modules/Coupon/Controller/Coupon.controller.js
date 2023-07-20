 import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createCoupon = async (req, res, next) => {
  const { name } = req.body;
  
  if (await couponModel.findOne({ name }))
    return next(new Error(`Duplicate coupon name`, { cause: 409 }));
  // if(req.body.expireDate && req.body.amount){
  //   const {expireDate, amount} = req.body;
  //   const coupon = await couponModel.create({
  //     name,
  //     expireDate,
  //     amount
  //   });
  // return res.status(201).json({ message: "success", coupon });

  // }
  // else if(req.body.amount){
  //   const {amount} = req.body;
  //   const coupon = await couponModel.create({
  //     name,
  //     amount
  //   });
  // return res.status(201).json({ message: "success", coupon });

  // }
  // else if(req.body.expireDate){
  //   const {expireDate} = req.body;
  //   const coupon = await couponModel.create({
  //     name,
  //     expireDate
  //   });
  // return res.status(201).json({ message: "success", coupon });

  // }
  // else{
  const coupon = await couponModel.create({
    name,
    amount
  });
  return res.status(200).json({ message: "success", coupon });
// }
};

export const updateCoupon = async (req, res, next) => {
  console.log("req.body : ", req.body);
  const coupon = await couponModel.findById(req.params.couponId);
  if (!coupon)
    return next(
      new Error(`invalid coupon id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (coupon.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await couponModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate coupon name`, { cause: 409 }));
    console.log(req.body.name)
    coupon.name = req.body.name;
  }
  if(req.body.amount){
    if(coupon.amount === req.body.amount){
      return next(new Error(`same coupon amount`, { cause:409}));
    }
    coupon.amount = req.body.amount;
  }
  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
}


export const getSpecificCoupon = async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.couponId);
  if(!coupon)
    return res.status(404).json({ message: "no coupon found"});
  return res.status(200).json({message:"success", coupon});
}
export const getCoupons = async (req, res, next) => {
  const coupons = await couponModel.find();
  
  return res.status(200).json({message:"success", coupons});
}