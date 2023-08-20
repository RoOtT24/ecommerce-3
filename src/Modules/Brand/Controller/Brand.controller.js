import brandModel from "../../../../DB/model/Brand.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const createBrand = async (req, res, next) => {
  const { name } = req.body;
  const { catId } = req.params;
  if (await brandModel.findOne({ name }))
    return next(new Error(`Duplicate brand name`, { cause: 409 }));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/brand` }
  );
  const brand = await brandModel.create({
    name,
    image: { public_id, secure_url },
    categoryId: catId,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return res.status(201).json({ message: "success", brand });
};

export const updateBrand = async (req, res, next) => {
  const { brandId, catId } = req.params;
  const brand = await brandModel.findOne({ _id: brandId, categoryId: catId });
  if (!brand)
    return next(
      new Error(`invalid brand id ${req.params.catId}`, { cause: 400 })
    );
    if (req.body.name) {
      if (brand.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await brandModel.findOne({ name: req.body.name }))
    return next(new Error(`Duplicate brand name`, { cause: 409 }));
  
  brand.name = req.body.name;
}

if (req.body.file) {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.oath,
    { folder: `${process.env.APP_NAME}/brand` }
    );
    await cloudinary.uploader.destroy(brand.image.public_id);
    brand.image = { secure_url, public_id };
  }
  brand.updatedBy = req.user._id;
  await brand.save();
  return res.status(200).json({ message: "success", brand });
};

export const getSpecificBrand = async (req, res, next) => {
  const { catId, brandId } = req.params;
  const brand = await brandModel.findOne({ categoryId: catId, _id: brandId });
  if (!brand) return res.status(404).json({ message: "no brand found" });
  return res.status(200).json({ message: "success", brand });
};

export const getAllBrands = async (req, res, next) => {
  const categories = await brandModel.find();

  return res.status(200).json({ message: "success", categories });
};

export const getBrandsInCat = async (req, res, next) => {
  const { catId } = req.params;
  const brands = await brandModel.find({ categoryId: catId });

  return res.status(200).json({ message: "success", brands });
};


export const softDelete = async (req, res, next) => {
    let { brandId } = req.params;
    const brand = await brandModel.findOneAndUpdate(
      { _id: brandId },
      { isDeleted: true },
      { new: true }
    );
  
    if (!brand) {
      return next(new Error("no brand found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", brand });
  };


  export const forceDelete = async (req, res, next) => {
    let { brandId } = req.params;
    const brand = await brandModel.findOneAndDelete({
      _id: brandId,
      isDeleted: true,
    });
  
    if (!brand) {
      return next(new Error("no brand found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", brand });
  };