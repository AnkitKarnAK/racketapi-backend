const express = require("express");
const router = express.Router();
const {
  getWatchLaters,
  findUserWatchLaterById,
  getUserWatchLaterById,
  updateWatchLaterById,
} = require("../controllers/watchLater.controller");

router.route("/").get(getWatchLaters);

router.param("userId", findUserWatchLaterById);

router.route("/:userId").get(getUserWatchLaterById).post(updateWatchLaterById);

module.exports = router;
