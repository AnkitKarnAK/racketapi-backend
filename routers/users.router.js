const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  findUserByAuth,
  findUserById,
  getUserById,
  updateUserById,
} = require("../controllers/user.controller");

router.route("/").get(getUsers).post(addUser);

router.route("/login").post(findUserByAuth);

router.param("userId", findUserById);

router.route("/:userId").get(getUserById).post(updateUserById);

module.exports = router;
