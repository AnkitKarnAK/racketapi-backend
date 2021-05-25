const User = require("../../models/user.model");
const LikedVideo = require("../../models/video-library/likedVideo.model");

const getLikedVideos = async (req, res) => {
  const likedVideos = await LikedVideo.find({});
  res.json({ success: true, likedVideos });
};

const findUserLikedVideoById = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }

    let likedVideo = await LikedVideo.findOne({ userId });

    if (!likedVideo) {
      NewLikedVideo = new LikedVideo({ userId, videos: [] });
      likedVideo = await NewLikedVideo.save();
    }
    req.likedVideo = likedVideo;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrive likedVideo details",
      errorMessage: err.message,
    });
  }
};

const getUserLikedVideoById = async (req, res) => {
  try {
    let { likedVideo } = req;
    likedVideo = await likedVideo
      .populate({
        path: "videos.videoId",
        select:
          "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
      })
      .execPopulate();

    activeVideosInLikedVideo = likedVideo.videos.filter((item) => item.active);
    res
      .status(200)
      .json({ likedVideo: activeVideosInLikedVideo, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
};

const updateLikedVideoById = async (req, res) => {
  try {
    const videoUpdates = req.body;
    const { likedVideo } = req;

    const videoExists = likedVideo.videos.find(
      (video) => video.videoId == videoUpdates._id
    );

    // if video is already present in the likedVideo then toggling the status of video
    if (videoExists) {
      for (let video of likedVideo.videos) {
        if (videoUpdates._id == video.videoId) {
          video.active = !video.active;
        }
      }
    } else {
      likedVideo.videos.push({ videoId: videoUpdates._id, active: true });
    }
    let likedVideoSaved = await likedVideo.save();
    likedVideoSaved = await likedVideoSaved
      .populate({
        path: "videos.videoId",
        select:
          "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
      })
      .execPopulate();

    activeVideosInLikedVideo = likedVideoSaved.videos.filter(
      (item) => item.active
    );

    res
      .status(200)
      .json({ likedVideo: activeVideosInLikedVideo, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: err.message,
    });
  }
};

module.exports = {
  getLikedVideos,
  findUserLikedVideoById,
  getUserLikedVideoById,
  updateLikedVideoById,
};
