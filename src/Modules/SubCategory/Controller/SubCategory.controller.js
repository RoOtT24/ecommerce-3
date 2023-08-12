import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const {catId} = req.params;
  if (await subCategoryModel.findOne({ name }))
  return next(new Error(`Duplicate subCategory name`, { cause: 409 }));
  if(!await categoryModel.findById(catId))
  return next(new Error(`no such category`, { cause: 404 }));
  const slug = slugify(name);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/subCategory` }
    );
  const subCategory = await subCategoryModel.create({
    name,
    slug,
    image: { public_id, secure_url },
    categoryId:catId,
    createdBy:req.user._id,
    updatedBy:req.user._id
  });
  return res.status(201).json({ message: "success", subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const {catId, subCatId} = req.params;
  const subCat = await subCategoryModel.findOne({_id:subCatId, categoryId:catId});
  if (!subCat)
    return next(
      new Error(`invalid subCategory id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (subCat.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await subCategoryModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate subCategory name`, { cause: 409 }));

      subCat.name = req.body.name;
      subCat.slug = slugify(req.body.name);
  }

  if (req.body.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.oath,
      { folder: `${process.env.APP_NAME}/subCategory` }
    );
    await cloudinary.uploader.destroy(subCat.image.public_id);
    subCat.image = { secure_url, public_id };
  }
  subCat.updatedBy = req.user._id;
  await subCat.save();
  return res.status(200).json({ message: "success", subCat });
}



export const getSpecificSubCategory = async (req, res, next) => {
  const {catId, subCatId} = req.params;
  
  const subCategory = await subCategoryModel.findOne({_id: subCatId, categoryId: catId});
  if(!subCategory)
    return next(new Error("no subCategory found", {cause:404}));
  return res.status(200).json({message:"success", subCategory});
}


export const getSubCategoriesInCat = async (req, res, next) => {
  const {catId} = req.params;
  const subCategories = await subCategoryModel.find({categoryId:catId});
  
  return res.status(200).json({message:"success", subCategories});
}


export const getSubCategory = async (req, res, next) => {
  const subCategories = await subCategoryModel.find().populate({
    path:'categoryId',
    select:"-_id name"
  });
  
  return res.status(200).json({message:"success", subCategories});
}


export const getProducts = async (req, res, next) => {
  const {subCatId, catId} = req.params;
  const {products} = await subCategoryModel.findOne({_id:subCatId, categoryId:catId}).populate(
    {
      path:'products',
      match:{isDeleted:{$eq:false}}
    });
  return res.status(200).json({message:'success', products})
}