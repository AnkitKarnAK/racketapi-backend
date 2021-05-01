const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occured on server, check errorMessage",
    errorMessage: err.message,
  });
};

module.exports = { errorHandler };
