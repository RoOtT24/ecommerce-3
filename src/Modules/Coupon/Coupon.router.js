import { Router } from "express";
import * as CouponController from './Controller/Coupon.controller.js';
import * as validators from './Coupon.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Category/Category.EndPoint.js";
const router = Router({caseSensitive:true});


router.post('/', auth(endPoint.Admin), validation(validators.createCoupon), CouponController.createCoupon);
router.get('/', validation(validators.getCoupon), CouponController.getCoupons);
router.get('/:couponId', validation(validators.getSpecificCoupon), CouponController.getSpecificCoupon);
router.put('/:couponId', auth(endPoint.Admin), validation(validators.updateCoupon), CouponController.updateCoupon);

export default router;