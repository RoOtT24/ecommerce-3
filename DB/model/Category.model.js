
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
    }
},
{
    timestamps:true
})
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;


