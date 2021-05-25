const express = require("express");
const router = express.Router();
const {
  getPlaylists,
  findUserPlaylists,
  getUserPlaylists,
  createUserPlaylist,
  removeUserPlaylist,
  getUserPlaylistVideos,
  updateUserPlaylistVideo,
} = require("../../controllers/video-library/playlist.controller");

router.route("/").get(getPlaylists);

router.param("userId", findUserPlaylists);

router.route("/:userId").get(getUserPlaylists).post(createUserPlaylist);

router
  .route("/:userId/:playlistId")
  .get(getUserPlaylistVideos)
  .post(updateUserPlaylistVideo)
  .delete(removeUserPlaylist);

module.exports = router;
