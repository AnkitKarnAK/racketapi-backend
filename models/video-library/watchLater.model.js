const mongoose = require("mongoose");

const WatchLaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videos: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
      active: Boolean,
    },
  ],
});

const WatchLater = mongoose.model("WatchLater", WatchLaterSchema);

module.exports = WatchLater;
