import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as categoryController from './Controller/Category.controller.js';
import * as validators from './Category.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import subCategoryRouter from '../SubCategory/SubCategory.router.js'
import brandRouter from '../Brand/Brand.router.js'
const router = Router();

router.use('/:catId/subCategory', subCategoryRouter);
router.use('/:catId/brand', brandRouter);

router.post('/', fileUpload(fileValidation.image).single('image'),validation(validators.createCategory), asyncHandler( categoryController.createCategory) );
router.put('/:catId', fileUpload(fileValidation.image).single('image'),validation(validators.updateCategory), asyncHandler( categoryController.updateCategory));
router.get('/:catId', validation(validators.getSpecificCategory), asyncHandler( categoryController.getSpecificCategory));
router.get('/', validation(validators.getCategory), asyncHandler( categoryController.getCategory));

export default router;