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
    catId
  });
  return res.status(201).json({ message: "success", subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.catId);
  if (!subCategory)
    return next(
      new Error(`invalid subCategory id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (subCategory.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await subCategoryModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate subCategory name`, { cause: 409 }));

    subCategory.name = req.body.name;
    subCategory.slug = slugify(req.body.name);
  }

  if (req.body.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.oath,
      { folder: `${process.env.APP_NAME}/subCategory` }
    );
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    subCategory.image = { secure_url, public_id };
  }
  await subCategory.save();
  return res.status(200).json({ message: "success", subCategory });
}


export const getSpecificSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.catId);
  if(!subCategory)
    return next(new Error("no subCategory found", {cause:404}));
  return res.status(200).json({message:"success", subCategory});
}
export const getSubCategory = async (req, res, next) => {
  const categories = await subCategoryModel.find();
  
  return res.status(200).json({message:"success", categories});
}