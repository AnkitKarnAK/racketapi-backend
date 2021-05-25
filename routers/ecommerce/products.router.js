const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProduct,
  findProductById,
  getProductById,
  updateProductById,
} = require("../../controllers/ecommerce/product.controller");

router.route("/").get(getProducts).post(addProduct);

router.param("productId", findProductById);

router.route("/:productId").get(getProductById).post(updateProductById);

module.exports = router;
