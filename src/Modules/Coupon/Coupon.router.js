import { Router } from "express";
import * as CouponController from './Controller/Coupon.controller.js';
import * as validators from './Coupon.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Coupon/Coupon.EndPoint.js";
const router = Router({caseSensitive:true});


router.post('/', auth(endPoint.create), validation(validators.createCoupon), asyncHandler(CouponController.createCoupon));
router.get('/', validation(validators.getCoupon), CouponController.getCoupons);
router.get('/:couponId', validation(validators.getSpecificCoupon), asyncHandler(CouponController.getSpecificCoupon));
router.put('/:couponId', auth(endPoint.update), validation(validators.updateCoupon), asyncHandler(CouponController.updateCoupon));
router.delete('/:couponId', auth(endPoint.delete), validation(validators.deleteCoupon), asyncHandler(CouponController.deleteCoupon));

export default router;