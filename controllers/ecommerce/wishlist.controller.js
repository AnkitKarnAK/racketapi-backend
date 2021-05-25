const User = require("../../models/user.model");
const Wishlist = require("../../models/ecommerce/wishlist.model");

const getWishlists = async (req, res) => {
  const wishlists = await Wishlist.find({});
  res.json({ success: true, wishlists });
};

const findUserWishlistById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      NewWishlist = new Wishlist({ userId, products: [] });
      wishlist = await NewWishlist.save();
    }
    req.wishlist = wishlist;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive wishlist details",
      errorMessage: err.message,
    });
  }
};

const getUserWishlistById = async (req, res) => {
  try {
    let { wishlist } = req;
    wishlist = await wishlist
      .populate({
        path: "products.productId",
        select:
          "name price image totalPrice discount rating fastDelivery inStock",
      })
      .execPopulate();

    activeProductsInWishlist = wishlist.products.filter((item) => item.active);
    res.status(200).json({ wishlist: activeProductsInWishlist, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
};

const updateWishlistById = async (req, res) => {
  try {
    const productUpdates = req.body;
    const { wishlist } = req;

    const productExists = wishlist.products.find(
      (product) => product.productId == productUpdates._id
    );

    // if product is already present in the wishlist then toggling the status of product
    if (productExists) {
      for (let product of wishlist.products) {
        if (productUpdates._id == product.productId) {
          product.active = !product.active;
        }
      }
    } else {
      wishlist.products.push({ productId: productUpdates._id, active: true });
    }
    let wishlistSaved = await wishlist.save();
    wishlistSaved = await wishlistSaved
      .populate({
        path: "products.productId",
        select:
          "name price image totalPrice discount rating fastDelivery inStock",
      })
      .execPopulate();

    activeProductsInWishlist = wishlistSaved.products.filter(
      (item) => item.active
    );

    res.status(200).json({ wishlist: activeProductsInWishlist, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getWishlists,
  findUserWishlistById,
  getUserWishlistById,
  updateWishlistById,
};
