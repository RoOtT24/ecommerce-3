import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';

export const signupSchema = 
{
    body:joi.object({
        userName:joi.string().alphanum().min(3).max(20).required().messages({
            'any.required':'username is required',
            'string.empty':'username is required'
        }),
        email:generalFields.email,
        password:generalFields.password,
        cPassword:joi.string().valid(joi.ref('password')).required(),
    }).required(),
}

export const loginSchema = {
    body:joi.object({
        email:generalFields.email,
        password:generalFields.password,
    }).required()
};