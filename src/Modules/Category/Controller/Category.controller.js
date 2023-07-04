import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (await categoryModel.findOne({ name }))
    return next(new Error(`Duplicate category name`, {cause:409}));
  const slug = slugify(name);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category` }
  );

  const category = await categoryModel.create({
    name,
    slug,
    image: { public_id, secure_url },
  });

  return res.status(201).json({ message: "success", category });
};
