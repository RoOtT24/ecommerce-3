import mongoose, { Schema, Types, model } from "mongoose";
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    colors: [String],
    sizes: [
      {
        type: String,
        enum: ["s", "m", "l", "xl"],
      },
    ],
    mainImage: {
      type: Object,
      required: true,
    },
    subImages: {
      type: Object,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User", // will be required: true after prototype
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User", // will be required: true after prototype
    },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

productSchema.virtual('reviews', {
    localField:'_id',
    foreignField:'productId',
    ref:"Review"
})
const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
