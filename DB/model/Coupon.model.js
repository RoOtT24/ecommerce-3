
import mongoose, {Schema,Types,model} from 'mongoose';
const couponSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    amount:{
        type:Number,
        default:1,
    },
    expireDate:{type:Date, required:true},// after prototype
    usedBy:[{type:Types.ObjectId, ref:'User'}],
    createdBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    },
    updatedBy:{
        type:Types.ObjectId, ref:'User', // will be required: true after prototype
    }
},
{
    timestamps:true
})

const couponModel = mongoose.models.Coupon ||  model('Coupon', couponSchema);
export default couponModel;


