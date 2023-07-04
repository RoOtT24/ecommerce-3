
import joi from 'joi'

const dataMethods = ['body','query','params','headers','file'];

const validationObjectId =(value,helper)=>{

    if(Types.ObjectId.isValid(value)){
        return true 
    }else {

        return helper.message("rteertertertertreterte")

    }
}

export const generalFields = {

    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:joi.string().min(3).required(),
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required(),
        dest:joi.string(),
    }),
    id:joi.string().custom(validationObjectId).min(24).max(24).required(),
}

const validation = (schema)=>{
    return (req,res,next)=>{
        
        const inputsData = {...req.body, ...req.params, ...req.query, file:req.file};
        const validationResult = schema.validate(inputsData,{abortEarly:false})
        // return res.json({validationResult})
        if(validationResult.error?.details){
            return res.json({message:"validation error",error:validationResult.error.details});
        }
        return next();
}
}

export default validation;