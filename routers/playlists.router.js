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
} = require("../controllers/playlist.controller");

router.route("/").get(getPlaylists);

router.param("userId", findUserPlaylists);

router
  .route("/:userId")
  .get(getUserPlaylists)
  .post(createUserPlaylist)
  .delete(removeUserPlaylist);

router
  .route("/:userId/:playlistId")
  .get(getUserPlaylistVideos)
  .post(updateUserPlaylistVideo);

module.exports = router;
