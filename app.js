require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const cookiesParser = require("cookie-parser");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const router = require("./routes/user");


const app = express();
const PORT = process.env.PORT;


mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiesParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => console.log(`Server started at Port: ${PORT} `));
