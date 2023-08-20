
import mongoose, {Schema,Types,model} from 'mongoose';
const brandSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:Object,
        required:true,
    },
    createdBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    },
    updatedBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    },
    categoryId:{type:Types.ObjectId, ref:'Category', required:true},
    isDeleted: { type: Boolean, default: false },
},
{
    timestamps:true
})
const brandModel = mongoose.models.Brand ||  model('Brand', brandSchema);
export default brandModel;


