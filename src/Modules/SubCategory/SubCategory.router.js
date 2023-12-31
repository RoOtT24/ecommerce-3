import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as subCategoryController from './Controller/SubCategory.controller.js';
import * as validators from './SubCategory.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { endPoint } from "../SubCategory/SubCategory.EndPoint.js";
import { auth } from "../../Middleware/auth.middleware.js";
const router = Router({mergeParams: true, caseSensitive:true});
// http://localHost:3000/Category/CatId/subCategory/SubCatId
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'),validation(validators.createSubCategory), asyncHandler( subCategoryController.createSubCategory) );
router.put('/:subCatId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'),validation(validators.updateSubCategory), asyncHandler( subCategoryController.updateSubCategory));
router.get('/specific/:subCatId', validation(validators.getSpecificSubCategory), asyncHandler( subCategoryController.getSpecificSubCategory));
router.get('/all', validation(validators.getSubCategory), asyncHandler( subCategoryController.getSubCategory));
router.get('/', validation(validators.getSubCategoriesInCategory), asyncHandler( subCategoryController.getSubCategoriesInCat));
router.get('/:subCatId/products', auth(), validation(validators.getProducts), asyncHandler( subCategoryController.getProducts));

export default router;