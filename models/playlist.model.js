const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  playlists: [
    {
      name: {
        type: String,
        required: "Name of the playlist is required",
      },
      videos: [
        {
          videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
          active: Boolean,
        },
      ],
      active: Boolean,
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;
