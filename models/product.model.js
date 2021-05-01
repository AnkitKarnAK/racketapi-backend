const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:
        "Cannot enter a product without name, please enter product name",
    },
    price: {
      type: Number,
      required:
        "Cannot enter a product without price, please enter price of the product",
    },
    image: String,
    totalPrice: Number,
    discount: String,
    rating: Number,
    fastDelivery: Boolean,
    inStock: Boolean,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
