
import mongoose, {Schema,Types,model} from 'mongoose';
const reviewSchema = new Schema ({
    comment:{
        type:String,
        required:true,
        unique:true,
    },
    // image:{
    //     type:Object,
    //     required:true,
    // },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    orderId:{
        type:Types.ObjectId,
        required:true,
        ref:'Order'
    },
    createdBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    },
    updatedBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    },
    productId:{type:Types.ObjectId, ref:'Product', required:true},
},
{
    timestamps:true
})
const reviewModel = mongoose.models.Review ||  model('Review', reviewSchema);
export default reviewModel;


