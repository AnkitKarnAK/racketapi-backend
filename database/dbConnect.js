const mongoose = require("mongoose");
const mongoDB_URI = process.env.DATABASE_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoDB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("successfully connected with mongoDB");
  } catch (err) {
    console.error("mongoose connection failed...", err);
  }
};

module.exports = connectToDatabase;
