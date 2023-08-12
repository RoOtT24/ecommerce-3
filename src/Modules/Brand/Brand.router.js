import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as brandController from './Controller/Brand.controller.js';
import * as validators from './Brand.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "../Brand/Brand.EndPoint.js";
const router = Router({mergeParams:true, caseSensitive:true});
// http://localHost:3000/Category/CategoryId/Brand/brandId
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'),validation(validators.createBrand), asyncHandler( brandController.createBrand) );
router.put('/:brandId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'),validation(validators.updateBrand), asyncHandler( brandController.updateBrand));
router.get('/specific/:brandId', auth(endPoint.get), validation(validators.getSpecificBrand), asyncHandler( brandController.getSpecificBrand));
router.get('/', auth(endPoint.get), validation(validators.getBrandsInCat), asyncHandler( brandController.getBrandsInCat));
router.get('/all', auth(endPoint.get), validation(validators.getAllBrands), asyncHandler( brandController.getAllBrands));

export default router;