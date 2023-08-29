import productModel from "../../../../DB/model/Product.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createProduct = async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  const { mainImage, subImages } = req.files;
  const subCat = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!subCat) {
    return next(new Error("invalid subCategory or category", { cause: 404 }));
  }
  const brand = await brandModel.findOne({
    _id: brandId,
    categoryId,
  });
  if (!brand) {
    return next(new Error("invalid brand", { cause: 404 }));
  }

  req.body.slug = slugify(name);

  req.body.finalPrice = price - (price * (discount || 0)) / 100.0;
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/mainImage` }
  );
  req.body.mainImage = { secure_url, public_id };
  if (subImages) {
    req.body.subImages = [];
    for (const image of subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        { folder: `${process.env.APP_NAME}/product/subImages` }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }

  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "success", product });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { categoryId, subCategoryId, brandId } = req.body;
  const product = await productModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product)
    return next(new Error(`invalid product id ${productId}`, { cause: 400 }));

  const cat = await categoryModel.findOne({ _id: categoryId });
  if (cat) {
    product.categoryId = cat._id;
  }

  const subCat = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId: req.body.categoryId,
  });
  if (subCat) {
    product.subCategoryId = subCat._id;
  }

  const brand = await brandModel.findOne({
    _id: brandId,
    categoryId: req.body.categoryId,
    subCategoryId: req.body.subCategoryId,
  });
  if (brand) {
    product.brandId = brand._id;
  }

  if (req.body.name) {
    if (product.name === req.body.name)
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await productModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate product name`, { cause: 409 }));

    product.name = req.body.name;
    product.slug = slugify(product.name);
  }

  if (req.body.description) {
    if (product.description === req.body.description)
      return next(
        new Error(`old description matches the new description`, { cause: 409 })
      );

    product.description = req.body.description;
  }

  if (req.body.discount) {
    if (product.discount === req.body.discount)
      return next(
        new Error(`old discount matches the new discount`, { cause: 409 })
      );
    product.discount = req.body.discount;
  }

  if (req.body.stock) {
    if (product.stock === req.body.stock)
      return next(new Error(`old stock matches the new stock`, { cause: 409 }));
    product.stock = req.body.stock;
  }

  if (req.body.price) {
    if (product.price === req.body.price)
      return next(new Error(`old price matches the new price`, { cause: 409 }));
    product.price = req.body.price;
  }

  if (req.body.colors) {
    if (product.colors === req.body.colors)
      return next(
        new Error(`old colors matches the new colors`, { cause: 409 })
      );
    product.colors = req.body.colors;
  }

  if (req.body.sizes) {
    if (product.sizes === req.body.sizes)
      return next(new Error(`old sizes matches the new name`, { cause: 409 }));
    product.sizes = req.body.sizes;
  }

  if (req.body.files) {
    if (req.body.files?.mainImage[0]) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].oath,
        { folder: `${process.env.APP_NAME}/product` }
      );
      await cloudinary.uploader.destroy(product.mainImage.public_id);
      product.mainImage = { secure_url, public_id };
    }
    if (req.body.files?.subImages) {
      for (const img in product.subImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      product.subImages = [];
      for (const img in req.body.files?.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.mainImage[0].oath,
          { folder: `${process.env.APP_NAME}/product` }
        );
        product.subImages.push({ secure_url, public_id });
      }
    }
  }

  product.finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100.0;
  product.updatedBy = req.user._id;
  await product.save();
  return res.status(200).json({ message: "success", product });
};

export const getSpecificProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel
    .findOne({ _id:productId, isDeleted: false })
    .populate("reviews");
  if (!product) return res.status(404).json({ message: "no product found" });
  return res.status(200).json({ message: "success", product });
};

export const getAllProducts = async (req, res, next) => {
  const { page, size, sort, search } = req.query;
  const ecxQueryParams = ["page", "size", "sort", "search"];
  const filterQuery = { ...req.query };
  ecxQueryParams.map((param) => {
    delete filterQuery[param];
  });
  const query = JSON.parse(
    JSON.stringify(filterQuery).replace(
      /(gt|gte|lt|lte|in|nin|eq|neq)/g,
      (match) => `$${match}`
    )
  );
  const { price, stock } = query;
  const skip = ((page ?? 1) - 1) * (size || 5);
  req.products = productModel
    .find({ isDeleted: false, price, stock })
    .populate("reviews")
    .limit(size ?? 5)
    .skip(skip)
    .sort(sort?.replaceAll(",", " "));
  if (search) {
    req.products = await req.products.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
  } else {
    req.products = await req.products;
  }
  const products = req.products;
  // } else
  //   req.products = await productModel
  //     .find({ isDeleted: false, price, stock })
  //     .populate("reviews")
  //     .limit(5).sort(sort?.replaceAll(',', ' ')).find({
  //      $or:[ {name:{$regex:search, $options:'i'}},
  //       {description:{$regex:search, $options:'i'}},]
  //     });
  if (!products) {
    return next(new Error("no products found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", products: req.products });
};

export const softDelete = async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findOneAndUpdate(
    { _id: productId },
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    return next(new Error("no product found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const restore = async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findOneAndUpdate(
    { _id: productId, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );

  if (!product) {
    return next(new Error("no product found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const forceDelete = async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findOneAndDelete({
    _id: productId,
    isDeleted: true,
  });

  if (!product) {
    return next(new Error("no product found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", product });
};

export const getSoftDelete = async (req, res, next) => {
  const products = await productModel.find({ isDeleted: true });
  return res.status(200).json({ message: "success", products });
};
