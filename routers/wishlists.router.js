const express = require("express");
const router = express.Router();
const {
  getWishlists,
  findUserWishlistById,
  getUserWishlistById,
  updateWishlistById,
} = require("../controllers/wishlist.controller");

router.route("/").get(getWishlists);

router.param("userId", findUserWishlistById);

router.route("/:userId").get(getUserWishlistById).post(updateWishlistById);

module.exports = router;
