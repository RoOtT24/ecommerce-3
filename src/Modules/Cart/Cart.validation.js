import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createCart = joi.object({
    // body:{
    productId:generalFields.id,
    qty:joi.number().min(1),
    
// },
}).required();


export const removeItem = joi.object({
    productId:generalFields.id,
}).required();



export const clearCart = joi.object({
}).required();



export const getSpecificCart = joi.object({
}).required();

export const getAllCarts = joi.object({
}).required();

