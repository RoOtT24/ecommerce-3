import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as productController from './Controller/Product.controller.js';
import * as validators from './Product.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Product/Product.EndPoint.js";
const router = Router({mergeParams:true, caseSensitive:true});

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([{name:'mainImage', maxCount:1}, {name:'subImages', maxCount:5}]), validation(validators.createProduct), asyncHandler( productController.createProduct) );
router.put('/:productId', auth(endPoint.update), fileUpload(fileValidation.image).fields([{name:'mainImage', maxCount:1}, {name:'subImages', maxCount:5}]),validation(validators.updateProduct), asyncHandler( productController.updateProduct));
router.get('/specific/:productId', auth(endPoint.get), validation(validators.getSpecificProduct), asyncHandler( productController.getSpecificProduct));
router.get('/all', auth(), validation(validators.getAllProducts), asyncHandler( productController.getAllProducts));
router.patch('/softDelete/:productId', auth(endPoint.softDelete), validation(validators.softDelete), asyncHandler(productController.softDelete));
router.delete('/forceDelete/:productId', auth(endPoint.forceDelete), validation(validators.softDelete), asyncHandler(productController.forceDelete));
router.patch('/restore/:productId', auth(endPoint.restore), validation(validators.softDelete), asyncHandler(productController.restore));
router.get('/getSoftDelete', auth(), validation(validators.getAllProducts), asyncHandler(productController.getSoftDelete));

export default router;