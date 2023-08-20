import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createCategory = joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFields.file.required(),
}).required();


export const updateCategory = joi.object({
    // body:{
    name:joi.string().min(2).max(20),
    catId:generalFields.id,
    file:generalFields.file,
// },
}).required();


export const getSpecificCategory = joi.object({
    catId:generalFields.id.required(),
}).required();

export const getCategory = joi.object({
    
}).required();


export const forceDelete = joi.object({
    categoryId:generalFields.id.required(),
});