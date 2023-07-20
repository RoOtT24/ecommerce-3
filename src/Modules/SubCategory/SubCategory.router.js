import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as subCategoryController from './Controller/SubCategory.controller.js';
import * as validators from './SubCategory.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
const router = Router({mergeParams: true});

router.post('/',fileUpload(fileValidation.image).single('image'),validation(validators.createSubCategory), asyncHandler( subCategoryController.createSubCategory) );
router.put('/:subCatId', fileUpload(fileValidation.image).single('image'),validation(validators.updateSubCategory), asyncHandler( subCategoryController.updateSubCategory));
router.get('/specific/:subCatId', validation(validators.getSpecificSubCategory), asyncHandler( subCategoryController.getSpecificSubCategory));
router.get('/all', validation(validators.getSubCategory), asyncHandler( subCategoryController.getSubCategory));
router.get('/', validation(validators.getSubCategoriesInCategory), asyncHandler( subCategoryController.getSubCategoriesInCat));


export default router;