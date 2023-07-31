import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
const router =Router();

router.post('/signup', asyncHandler(AuthController.signup))
router.post('/login',validation(validators.loginSchema),asyncHandler(AuthController.login))
router.get('/confirmEmail/:token', asyncHandler(AuthController.confirmEmail))
router.get('/newConfirmEmail/:token', asyncHandler(AuthController.newConfirmEmail))
router.patch('/sendCode', asyncHandler(AuthController.sendCode));
router.patch('/forgetPassword', asyncHandler(AuthController.forgetPassword));

export default router;