import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createCart = joi.object({
    // body:{
    userId:generalFields.id,
    productId:generalFields.id,
    qty:joi.number().min(1),
    
// },
}).required();


export const updateCart = joi.object({
    // body:{
    name:joi.string().min(2).max(20),
    catId:generalFields.id.required(),
    cartId:generalFields.id.required(),
    file:generalFields.file,
// },
}).required();


export const getSpecificCart = joi.object({
    catId:generalFields.id.required(),
    cartId:generalFields.id.required(),
}).required();

export const getAllCarts = joi.object({
    // catId:generalFields.id.required()
}).required();


export const getCartsInCat = joi.object({
    catId:generalFields.id.required()
}).required();