const Cart = require("../models/cart.model");
const User = require("../models/user.model");

const { extend } = require("lodash");

const getCarts = async (req, res) => {
  const carts = await Cart.find({});
  res.json({ success: true, carts });
};

const findUserCartById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      NewCart = new Cart({ userId, products: [] });
      cart = await NewCart.save();
    }
    req.cart = cart;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive cart details",
      errorMessage: err.message,
    });
  }
};

const getUserCartById = async (req, res) => {
  try {
    let { cart } = req;
    cart = await cart
      .populate({
        path: "products.productId",
        select:
          "name price image totalPrice discount rating fastDelivery inStock",
      })
      .execPopulate();

    activeProductsInCart = cart.products.filter((item) => item.active);

    res.status(200).json({ cart: activeProductsInCart, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
};

const updateCartById = async (req, res) => {
  try {
    const productUpdates = req.body;
    const { cart } = req;

    const productExists = cart.products.find(
      (product) => product.productId == productUpdates._id
    );

    if (productExists) {
      for (let product of cart.products) {
        if (productUpdates._id == product.productId) {
          product = extend(product, productUpdates);
        }
      }
    } else {
      cart.products.push({
        productId: productUpdates._id,
        quantity: 1,
        active: true,
      });
    }
    let cartSaved = await cart.save();
    cartSaved = await cartSaved
      .populate({
        path: "products.productId",
        select:
          "name price image totalPrice discount rating fastDelivery inStock",
      })
      .execPopulate();

    activeProductsInCart = cartSaved.products.filter((item) => item.active);

    res.status(200).json({ cart: activeProductsInCart, success: true });
  } catch (error) {
    res.json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  getCarts,
  findUserCartById,
  getUserCartById,
  updateCartById,
};
