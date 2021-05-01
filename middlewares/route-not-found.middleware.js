const routeNotFound = (req, res, next) => {
  res
    .status(404)
    .json({
      success: false,
      message: "api route you are trying to access, does not exists on server",
    });
};

module.exports = { routeNotFound };
