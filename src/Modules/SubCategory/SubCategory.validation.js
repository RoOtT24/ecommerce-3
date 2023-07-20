import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createSubCategory = joi.object({
    // body:{
    name:joi.string().min(2).max(20).required(),
    catId:generalFields.id.required(),
    file:generalFields.file.required(),
// },
}).required();


export const updateSubCategory = joi.object({
    // body:{
    name:joi.string().min(2).max(20),
    catId:generalFields.id,
    subCatId:generalFields.id,
    file:generalFields.file,
// },
}).required();


export const getSpecificSubCategory = joi.object({
    subCatId:generalFields.id.required(),
    catId:generalFields.id.required(),
}).required();

export const getSubCategoriesInCategory = joi.object({
    catId:generalFields.id.required()
    
}).required();


export const getSubCategory = joi.object({
}).required();


