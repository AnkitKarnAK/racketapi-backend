const User = require("../models/user.model");
const Playlist = require("../models/playlist.model");
const { concat } = require("lodash");

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({});
    res.json({ success: true, playlists });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get the playlists",
      errorMessage: err.message,
    });
  }
};

const findUserPlaylists = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }

    let playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      newPlaylist = new Playlist({
        userId,
        playlists: [
          {
            name: "Demo Playlist",
            videos: [],
            active: true,
          },
        ],
      });
      playlist = await newPlaylist.save();
    }
    req.playlist = playlist;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve users playlists",
      errorMessage: err.message,
    });
  }
};

const getActivePlaylistItems = async (playlist) => {
  playlist.playlists = playlist.playlists.filter((list) => list.active);
  for (let list of playlist.playlists) {
    if (list.videos.length > 0) {
      list.videos = list.videos.filter((video) => video.active);
    }
  }
  return playlist.playlists;
};

const getUserPlaylists = async (req, res) => {
  try {
    let { playlist } = req;
    const playlistItems = await getActivePlaylistItems(playlist);
    res.json({ success: true, playlists: playlistItems });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve the playlist",
      errorMessage: err.message,
    });
  }
};

const createUserPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    let { playlist } = req;
    let newList = {
      name,
      videos: [],
      active: true,
    };
    playlist.playlists = concat(playlist.playlists, newList);
    let updatedPlaylist = await playlist.save();
    updatedPlaylist = await getActivePlaylistItems(updatedPlaylist);
    res.status(201).json({ success: true, playlists: updatedPlaylist });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create new playlist",
      errorMessage: err.message,
    });
  }
};

const removeUserPlaylist = async (req, res) => {
  try {
    let { playlist } = req;
    const { _id: playlistId } = req.body;

    for (let list of playlist.playlists) {
      if (list._id == playlistId) {
        list.videos = [];
        list.active = false;
        break;
      }
    }

    let updatedPlaylist = await playlist.save();
    updatedPlaylist = await getActivePlaylistItems(updatedPlaylist);
    res.json({ success: true, playlists: updatedPlaylist });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to remove playlist",
      errorMessage: err.message,
    });
  }
};

const findVideosInPlaylist = (playlist, listId) => {
  let playlistItem = playlist.playlists.find(
    (item) => item._id == listId && item.active
  );

  if (!playlistItem) {
    throw Error(
      "Playlist item not found. It may either be deleted or not created"
    );
  }
  return playlistItem.videos;
};

const findActiveVideos = (videoList) => {
  return videoList.filter((item) => item.active);
};

const getUserPlaylistVideos = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { playlist } = req;
    await playlist
      .populate({
        path: "playlists.videos.videoId",
        select:
          "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
      })
      .execPopulate();
    let playlistVideos = findVideosInPlaylist(playlist, playlistId);
    playlistVideos = findActiveVideos(playlistVideos);
    res.json({ success: true, videos: playlistVideos });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get playlist videos",
      errorMessage: err.message,
    });
  }
};

const updateUserPlaylistVideo = async (req, res) => {
  let { playlist } = req;
  const { playlistId } = req.params;
  const { _id: videoId } = req.body;
  let playlistVideos = findVideosInPlaylist(playlist, playlistId);
  playlistVideos = playlistVideos.map((item) => item.videoId);
  const videoExists = playlistVideos.some((item) => item == videoId);
  for (let list of playlist.playlists) {
    if (list._id == playlistId) {
      if (videoExists) {
        for (let video of list.videos) {
          if (video.videoId == videoId) {
            video.active = !video.active;
            break;
          }
        }
      } else {
        list.videos.push({ videoId, active: true });
        break;
      }
    }
  }
  let updatedPlaylist = await playlist.save();
  await playlist
    .populate({
      path: "playlists.videos.videoId",
      select:
        "title videoId url viewCount date likes dislikes channelName channelSubscribers duration html image",
    })
    .execPopulate();
  playlistVideos = findVideosInPlaylist(updatedPlaylist, playlistId);
  playlistVideos = findActiveVideos(playlistVideos);
  res.json({ success: true, videos: playlistVideos });
};

module.exports = {
  getPlaylists,
  findUserPlaylists,
  getUserPlaylists,
  createUserPlaylist,
  removeUserPlaylist,
  getUserPlaylistVideos,
  updateUserPlaylistVideo,
};
