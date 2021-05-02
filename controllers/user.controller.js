const User = require("../models/user.model");
const { extend } = require("lodash");

const getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      user.__v = undefined;
      return user;
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get the list of users",
      errorMessage: err.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const newUserData = req.body;
    const emailExists = await User.exists({ email: newUserData.email });
    if (emailExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }
    const NewUser = new User(newUserData);
    const savedUser = await NewUser.save();
    const user = { _id: savedUser._id, name: savedUser.name };
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user",
      errorMessage: err.message,
    });
  }
};

const findUserByAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailExists = await User.exists({ email });
    if (emailExists) {
      const userExists = await User.findOne({ email, password });
      if (userExists) {
        return res.status(200).json({
          success: true,
          user: { _id: userExists._id, name: userExists.name },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "password is incorrect",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "email does not exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: err.message,
    });
  }
};

const findUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found with this id" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "not a valid user id" });
  }
};

const getUserById = async (req, res) => {
  const { user } = req;
  user.password = undefined;
  user.__v = undefined;
  res.json({ success: true, user });
};

const updateUserById = async (req, res) => {
  const userUpdates = req.body;
  let { user } = req;
  userUpdated = extend(user, userUpdates);
  userSaved = await userUpdated.save();
  userSaved.password = undefined;
  res.json({ success: true, userSaved });
};

module.exports = {
  getUsers,
  addUser,
  findUserByAuth,
  findUserById,
  getUserById,
  updateUserById,
};
