import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as cartController from './Controller/Cart.controller.js';
import * as validators from './Cart.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Cart/Cart.EndPoint.js";
const router = Router({mergeParams:true, caseSensitive:true});
// http://localHost:3000/Category/CategoryId/Cart/cartId
router.post('/', auth(endPoint.create), validation(validators.createCart), asyncHandler( cartController.addProductToCart) );
// router.put('/:cartId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'),validation(validators.updateCart), asyncHandler( cartController.updateCart));
router.get('/specific/:cartId', auth(endPoint.get), validation(validators.getSpecificCart), asyncHandler( cartController.getSpecificCart));
router.get('/', auth(endPoint.get), validation(validators.getCartsInCat), asyncHandler( cartController.getCartsInCat));
router.get('/all', auth(endPoint.get), validation(validators.getAllCarts), asyncHandler( cartController.getAllCarts));

export default router;