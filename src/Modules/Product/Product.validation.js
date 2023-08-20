import joi from 'joi'
import { generalFields, validationObjectId } from '../../Middleware/validation.js';


export const createProduct = joi.object({
    // body:{
    name:joi.string().min(2).max(50).required(),
    // file:generalFields.file.required(),
    categoryId:generalFields.id.required(),
    brandId:generalFields.id.required(),
    subCategoryId:generalFields.id.required(),
    files:joi.object({mainImage:joi.array().items(generalFields.file).required(), subImages:joi.array().items(generalFields.file)}).required(),
    description:joi.string().min(10).required(),
    colors:joi.array(),
    sizes:joi.array(),
    stock:joi.number().min(0).required(),
    price:joi.number().min(0).required(),
    discount:joi.number().min(0).max(100).required(),
// },
}).required();


export const updateProduct = joi.object({
    name:joi.string().min(2).max(50),
    description:joi.string(),
    stock:joi.number().min(0),
    price:joi.number().min(0),
    discount:joi.number().min(0).max(100),
    colors:joi.array(),
    sizes:joi.array(),
    files:joi.object({mainImage:joi.array().items(generalFields.file), subImages:joi.array().items(generalFields.file)}),
    subImages:joi.array(),
    productId:generalFields.id.required(),
    categoryId:joi.string().custom(validationObjectId),
    brandId:joi.string().custom(validationObjectId),
    subCategoryId:joi.string().custom(validationObjectId),
}).required();


export const getSpecificProduct = joi.object({
    productId:generalFields.id.required(),
}).required();

export const getAllProducts = joi.object({
    size:joi.number().min(1),
    page:joi.number().min(1),
    price:joi.object(),
    stock:joi.object(),
    sort:joi.string(),
    search:joi.string(),
}).required();


export const getProductsInCat = joi.object({
    catId:generalFields.id.required()
}).required();


export const softDelete = joi.object({
    productId:generalFields.id.required(),
}).required();