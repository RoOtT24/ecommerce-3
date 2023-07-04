import { generalFields } from "../../Middleware/validation.js";
import joi from 'joi';

export const profilePic = {
    file:generalFields.file.required(),
}

export const updatePassword = {

    body:joi.object({
        oldPassword:generalFields.password,
        newPassword:generalFields.password.invalid(joi.ref('oldPassword')),
        cPassword:joi.string().valid(joi.ref('newPassword')).required(),

}).required(),
}

export const shareProfile = {
    params:joi.object({
        id:generalFields.id
    }).required()

}