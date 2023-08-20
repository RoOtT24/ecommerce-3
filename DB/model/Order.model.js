
import mongoose, {Schema,Types,model} from 'mongoose';
const orderSchema = new Schema ({
    userId:{
        type:Types.ObjectId,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phoneNumber:[{
        type:String,
        required:true
    }],
    products:[{
        name:{type:String, required:true},
        productId:{
            type:Types.ObjectId, ref:'Product', required:true
        },
        qty:{type:Number, required:true},
        unitPrice:{type:Number, required:true},
        finalPrice:{type:Number, required:true},
    }],
    couponId:{
        type:Types.ObjectId, ref:'Coupon'
    },
    finalPrice:{
        type:Number, required:true
    },
    subTotal:{
        type:Number, required:true
    },
    paymentType:{
        type:String,
        enum:['Cash', 'Visa'],
        required:true,
    },
    status:{
        type:String,
        enum:['pending', 'cancelled', 'approved', 'onWay', 'delivered'],
        default:'pending'
    },
    cancelReason:String,
    note:String,
    updatedBy:{type:Types.ObjectId, ref:'User'},
},
{
    timestamps:true
})
const orderModel = mongoose.models.Order ||  model('Order', orderSchema);
export default orderModel;


