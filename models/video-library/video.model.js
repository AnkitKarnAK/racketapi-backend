const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: "Video ID is a required attribute",
      unique: true,
    },
    title: {
      type: String,
      required: "Name of the video is a required attribute",
    },
    url: String,
    viewCount: Number,
    date: String,
    likes: Number,
    dislikes: Number,
    channelName: String,
    channelSubscribers: Number,
    duration: String,
    html: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
