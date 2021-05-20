const User = require("../models/user.model");
const WatchLater = require("../models/watchLater.model");

const getWatchLaters = async (req, res) => {
  const watchLaters = await WatchLater.find({});
  res.json({ success: true, watchLaters });
};

const findUserWatchLaterById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }

    let watchLater = await WatchLater.findOne({ userId });

    if (!watchLater) {
      NewWatchLater = new WatchLater({ userId, videos: [] });
      watchLater = await NewWatchLater.save();
    }
    req.watchLater = watchLater;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive watchLater details",
      errorMessage: err.message,
    });
  }
};

const getUserWatchLaterById = async (req, res) => {
  try {
    let { watchLater } = req;
    watchLater = await watchLater
      .populate({
        path: "videos.videoId",
        select:
          "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
      })
      .execPopulate();

    activeVideosInWatchLater = watchLater.videos.filter((item) => item.active);
    res
      .status(200)
      .json({ watchLater: activeVideosInWatchLater, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
};

const updateWatchLaterById = async (req, res) => {
  try {
    const videoUpdates = req.body;
    const { watchLater } = req;

    const videoExists = watchLater.videos.find(
      (video) => video.videoId == videoUpdates._id
    );

    // if video is already present in the watchLater then toggling the status of video
    if (videoExists) {
      for (let video of watchLater.videos) {
        if (videoUpdates._id == video.videoId) {
          video.active = !video.active;
        }
      }
    } else {
      watchLater.videos.push({ videoId: videoUpdates._id, active: true });
    }
    let watchLaterSaved = await watchLater.save();
    watchLaterSaved = await watchLaterSaved
      .populate({
        path: "videos.videoId",
        select:
          "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
      })
      .execPopulate();

    activeVideosInWatchLater = watchLaterSaved.videos.filter(
      (item) => item.active
    );

    res
      .status(200)
      .json({ watchLater: activeVideosInWatchLater, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getWatchLaters,
  findUserWatchLaterById,
  getUserWatchLaterById,
  updateWatchLaterById,
};
