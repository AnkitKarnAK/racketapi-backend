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

router
  .route("/login")
  .get((req, res) => {
    res.json({
      success: true,
      message: "validate login by post request of email and password",
    });
  })
  .post(findUserByAuth);

router.param("userId", findUserById);

router.route("/:userId").get(getUserById).post(updateUserById);

module.exports = router;
