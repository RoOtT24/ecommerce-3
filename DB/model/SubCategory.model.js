
import mongoose, {Schema,Types,model} from 'mongoose';
const subCategorySchema = new Schema ({
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
    categoryId:{type:Types.ObjectId, ref:'Category', required:true},
},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})

subCategorySchema.virtual('products',{
    localField:'_id',
    foreignField:'subCategoryId',
    ref:'Product'
})
const subCategoryModel = mongoose.models.SubCategory ||  model('SubCategory', subCategorySchema);
export default subCategoryModel;


