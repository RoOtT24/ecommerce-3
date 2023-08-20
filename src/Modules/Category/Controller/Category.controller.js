import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (await categoryModel.findOne({ name }))
    return next(new Error(`Duplicate category name`, { cause: 409 }));
  const slug = slugify(name);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category/${name}` }
  );
  const category = await categoryModel.create({
    name,
    slug,
    image: { public_id, secure_url },
    createdBy:req.user._id,
    updatedBy:req.user._id
  });
  return res.status(201).json({ message: "success", category });
};

export const updateCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.catId);
  if (!category)
    return next(
      new Error(`invalid category id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (category.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await categoryModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate category name`, { cause: 409 }));

    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }

  if (req.body.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.oath,
      { folder: `${process.env.APP_NAME}/category` }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "success", category });
}


export const getSpecificCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.catId);
  if(!category)
    return res.status(404).json({ message: "no category found"});
  return res.status(200).json({message:"success", category});
}
export const getCategory = async (req, res, next) => {
  const categories = await categoryModel.find().populate('subCategory');
  
  return res.status(200).json({message:"success", categories});
}

export const forceDelete = async (req, res, next) => {
  let { categoryId } = req.params;
  const category = await categoryModel.findOneAndDelete({
    _id: categoryId,
  });

  if (!category) {
    return next(new Error("no category found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", category });
};
