import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as orderController from './Controller/Order.controller.js';
import * as validators from './Order.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Order.EndPoint.js";
const router = Router({caseSensitive:true});
// http://localHost:3000/Order/someId/subOrder


router.post('/', auth(endPoint.create), validation(validators.createOrder), asyncHandler( orderController.createOrder) );
router.post('/allItemsFromCart', auth(endPoint.create), validation(validators.createOrderWithAllItemsFromCart), asyncHandler( orderController.createOrderWithAllItemsFromCart) );
router.patch('/cancel/:orderId', auth(endPoint.cancel), validation(validators.cancelOrder), asyncHandler( orderController.cancelOrder ) );
router.patch('/changeStatus/:orderId', auth(endPoint.changeStatusFromAdmin), validation(validators.changeStatusFromAdmin), asyncHandler( orderController.changeStatusFromAdmin ) );
router.get('/', auth(endPoint.get), validation(validators.getOrder), asyncHandler( orderController.getOrder) );


export default router;