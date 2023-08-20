import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as cartController from './Controller/Cart.controller.js';
import * as validators from './Cart.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Cart/Cart.EndPoint.js";
const router = Router({mergeParams:true, caseSensitive:true});
// http://localHost:3000/Category/:CategoryId/Cart/:cartId
router.post('/', auth(endPoint.create), validation(validators.createCart), asyncHandler( cartController.addProductToCart) );
router.patch('/removeItem', auth(endPoint.clear), validation(validators.removeItem), asyncHandler( cartController.removeItem ) );
router.patch('/clear', auth(endPoint.clear), validation(validators.clearCart), asyncHandler( cartController.clearCart ) );
router.get('/', auth(endPoint.getOne), validation(validators.getSpecificCart), asyncHandler( cartController.getSpecificCart));
router.get('/all', auth(endPoint.get), validation(validators.getAllCarts), asyncHandler( cartController.getAllCarts));

export default router;