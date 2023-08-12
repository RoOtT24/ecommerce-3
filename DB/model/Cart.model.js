
import mongoose, {Schema,Types,model} from 'mongoose';
const cartSchema = new Schema ({
    userId:{type:Types.ObjectId, ref:'User', unique:true},
    products:[{
        productId:{type:Types.ObjectId, ref:'Product',required:true},
        qty:{type:Number, default:1, required:true}
    }]
},
{
    timestamps:true
})
const cartModel = mongoose.models.Cart ||  model('Cart', cartSchema);
export default cartModel;