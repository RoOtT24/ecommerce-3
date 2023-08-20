import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createReview = joi.object({
    comment:joi.string().min(2).max(80).required(),
    productId:generalFields.id.required(),
    rating:joi.number().min(1).max(5).required(),
}).required();


export const updateReview = joi.object({
    // body:{
    comment:joi.string().min(2).max(80),
    productId:generalFields.id.required(),
    rating:joi.number().min(1).max(5),
    reviewId:generalFields.id.required()
// },
}).required();


export const getSpecificReview = joi.object({
    catId:generalFields.id.required(),
}).required();

export const getReview = joi.object({
    
}).required();