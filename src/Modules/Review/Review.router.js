import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as reviewController from './Controller/Review.controller.js';
import * as validators from './Review.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Review.EndPoint.js";
const router = Router({mergeParams:true});

router.post('/', auth(endPoint.create), validation(validators.createReview), asyncHandler(reviewController.createReview));

export default router;