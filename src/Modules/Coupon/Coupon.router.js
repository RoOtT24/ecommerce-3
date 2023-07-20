import { Router } from "express";
import * as CouponController from './Controller/Coupon.controller.js';
import * as validators from './Coupon.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
const router = Router();


router.post('/', validation(validators.createCoupon), CouponController.createCoupon);
router.get('/', validation(validators.getCoupon), CouponController.getCoupons);
router.get('/:couponId', validation(validators.getSpecificCoupon), CouponController.getSpecificCoupon);
router.put('/:couponId', validation(validators.updateCoupon), CouponController.updateCoupon);

export default router;