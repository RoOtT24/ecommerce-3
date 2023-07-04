import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as categoryController from './Controller/Category.controller.js';
import * as validators from './Category.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
const router = Router();

router.post('/', fileUpload(fileValidation.image).single('image'),validation(validators.createCategory), asyncHandler( categoryController.createCategory) );

export default router;