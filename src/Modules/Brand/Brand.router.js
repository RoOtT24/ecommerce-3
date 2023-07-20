import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as brandController from './Controller/Brand.controller.js';
import * as validators from './Brand.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
const router = Router({mergeParams:true});

router.post('/', fileUpload(fileValidation.image).single('image'),validation(validators.createBrand), asyncHandler( brandController.createBrand) );
router.put('/:brandId', fileUpload(fileValidation.image).single('image'),validation(validators.updateBrand), asyncHandler( brandController.updateBrand));
router.get('/specific/:brandId', validation(validators.getSpecificBrand), asyncHandler( brandController.getSpecificBrand));
router.get('/', validation(validators.getBrandsInCat), asyncHandler( brandController.getBrandsInCat));
router.get('/all', validation(validators.getAllBrands), asyncHandler( brandController.getAllBrands));

export default router;