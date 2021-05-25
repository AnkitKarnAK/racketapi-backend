const Product = require("../../models/ecommerce/product.model");
const { extend } = require("lodash");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProductData = req.body;
    const NewProduct = new Product(newProductData);
    const savedProduct = await NewProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new product",
      errMessage: err.message,
    });
  }
};

const findProductById = async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "product not found with this id" });
    }

    req.product = product;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "not a valid product id" });
  }
};

const getProductById = async (req, res) => {
  const { product } = req;
  product.__v = undefined;
  res.json({ success: true, product });
};

const updateProductById = async (req, res) => {
  const productUpdates = req.body;
  let { product } = req;
  productUpdated = extend(product, productUpdates);
  productSaved = await productUpdated.save();
  productSaved.__v = undefined;
  res.json({ success: true, message: "product is updated", productSaved });
};

module.exports = {
  getProducts,
  addProduct,
  findProductById,
  getProductById,
  updateProductById,
};
