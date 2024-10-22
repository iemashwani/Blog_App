const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const Blog = require("./models/blog");
// require("dotenv").config();
// const dbLink = process.env.DB_URL;
const cookiesParser = require("cookie-parser");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

const { configDotenv } = require("dotenv");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose
  .connect(
    "mongodb+srv://as3141538:Blogify123@cluster0.arwe9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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
