const express = require("express");
const router = express.Router();
const {
  getVideos,
  addVideo,
  findVideoById,
  getVideoById,
  updateVideoById,
} = require("../controllers/video.controller");

router.route("/").get(getVideos).post(addVideo);

router.param("videoId", findVideoById);

router.route("/:videoId").get(getVideoById).post(updateVideoById);

module.exports = router;
