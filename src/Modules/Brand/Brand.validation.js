import joi from 'joi'
import { generalFields, validationObjectId } from '../../Middleware/validation.js';


export const createBrand = joi.object({
    // body:{
    name:joi.string().min(2).max(20).required(),
    file:generalFields.file.required(),
    catId:generalFields.id.required(),
    
// },
}).required();


export const updateBrand = joi.object({
    name:joi.string().min(2).max(20),
    catId:generalFields.id.required(),
    brandId:generalFields.id.required(),
    file:generalFields.file,
}).required();


export const getSpecificBrand = joi.object({
    catId:generalFields.id.required(),
    brandId:generalFields.id.required(),
}).required();

export const getAllBrands = joi.object({
    // catId:generalFields.id.required()
}).required();


export const getBrandsInCat = joi.object({
    catId:generalFields.id.required()
}).required();


export const softDelete = joi.object({
    brandId:generalFields.id.required(),
})