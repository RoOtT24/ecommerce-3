
import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
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
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
categorySchema.virtual('subCategory', {
    localField:'_id',
    foreignField:'categoryId',
    ref:"SubCategory"
})
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;


