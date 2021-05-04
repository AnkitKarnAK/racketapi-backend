const { extend } = require("lodash");
const Video = require("../models/video.model");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get the list of videos",
      errorMessage: err.message,
    });
  }
};

const addVideo = async (req, res) => {
  try {
    const newVideoData = req.body;
    const newVideo = new Video(newVideoData);
    const savedVideo = await newVideo.save();
    res.status(201).json({ success: true, video: savedVideo });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new video",
      errorMessage: err.message,
    });
  }
};

const findVideoById = async (req, res, next, videoId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(400)
        .json({ success: false, message: "video not found with this id" });
    }
    req.video = video;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "not a valid video id" });
  }
};

const getVideoById = async (req, res) => {
  const { video } = req;
  video.__v = undefined;
  res.json({ success: true, video });
};

const updateVideoById = async (req, res) => {
  const videoUpdates = req.body;
  let { video } = req;
  videoUpdated = extend(video, videoUpdates);
  videoSaved = await video.save();
  videoSaved.__v = undefined;
  res.json({ success: true, message: "video is updated", videoSaved });
};

module.exports = {
  getVideos,
  addVideo,
  findVideoById,
  getVideoById,
  updateVideoById,
};
