const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const products = require("./routers/products.router");
const users = require("./routers/users.router");
const carts = require("./routers/carts.router");
const wishlists = require("./routers/wishlists.router");
const videos = require("./routers/videos.router");
const likedVideos = require("./routers/likedVideos.router");
const watchLaters = require("./routers/watchLaters.router");
const playlists = require("./routers/playlists.router");

const connectToDatabase = require("./database/dbConnect");
const { routeNotFound } = require("./middlewares/route-not-found.middleware");
const { errorHandler } = require("./middlewares/error-handler.middleware");

const PORT = process.env.PORT || 3001;
const app = express();

connectToDatabase();

app.use(express.json());
app.use(cors());
app.use("/products", products);
app.use("/users", users);
app.use("/carts", carts);
app.use("/wishlists", wishlists);
app.use("/videos", videos);
app.use("/likedvideos", likedVideos);
app.use("/watchlaters", watchLaters);
app.use("/playlists", playlists);

app.get("/", (req, res) => {
  res.send("welcome to RacketAPI");
});

/* keep at end to handle errors & 404 route */
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
