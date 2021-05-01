const express = require("express");
const router = express.Router();
const {
  getCarts,
  findUserCartById,
  getUserCartById,
  updateCartById,
} = require("../controllers/cart.controller");

router.route("/").get(getCarts);

router.param("userId", findUserCartById);

router.route("/:userId").get(getUserCartById).post(updateCartById);

module.exports = router;
