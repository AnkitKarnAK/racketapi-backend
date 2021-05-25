const express = require("express");
const router = express.Router();
const {
  getLikedVideos,
  findUserLikedVideoById,
  getUserLikedVideoById,
  updateLikedVideoById,
} = require("../../controllers/video-library/likedVideo.controller");

router.route("/").get(getLikedVideos);

router.param("userId", findUserLikedVideoById);

router.route("/:userId").get(getUserLikedVideoById).post(updateLikedVideoById);

module.exports = router;
