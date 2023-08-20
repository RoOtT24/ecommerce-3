import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createOrder = joi.object({
    couponName:joi.string().min(2).max(30),
    phoneNumber:joi.string().min(10).required(),
    address:joi.string().min(5).required(),
    products:joi.array().items(joi.object({productId:generalFields.id.required(), qty:joi.number().min(1).required()})),
    paymentType:joi.string().required(),
}).required();



export const createOrderWithAllItemsFromCart = joi.object({
    couponName:joi.string().min(2).max(30),
    phoneNumber:joi.string().min(10).required(),
    address:joi.string().min(5).required(),
    // products:joi.array().items(joi.object({productId:generalFields.id.required(), qty:joi.number().min(1).required()})),
    paymentType:joi.string().required(),
}).required();


export const updateOrder = joi.object({
    // body:{
    name:joi.string().min(2).max(20),
    catId:generalFields.id,
    file:generalFields.file,
// },
}).required();


export const getSpecificOrder = joi.object({
    catId:generalFields.id.required(),
}).required();

export const getOrder = joi.object({
    
}).required();


export const cancelOrder = joi.object({
orderId:generalFields.id.required(),
cancelReason:joi.string().min(5).required(),
});


export const changeStatusFromAdmin = joi.object({
orderId:generalFields.id.required(),
status:joi.string().min(5).required(),
});