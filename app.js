const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
//mongoose code
mongoose.connect(
  "mongodb+srv://bickybong:test123@cluster0.6bqohup.mongodb.net/?retryWrites=true&w=majority"
);
// mongoose.connect("mongodb+srv://bickybong:test123@cluster0.bnspu6g.mongodb.net/blogDB");
const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  blogPosts = Blog.find(function (err, posts) {
    //finds the fruits
    if (err) {
      //if there is error
      console.log(err);
    } else {
      //no error
      res.render("home", {
        homePara: aboutContent,
        posts: posts,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutPara: homeStartingContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactPara: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Blog({
    title: req.body.composeTitle,
    body: req.body.composePost,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/:id", function (req, res) {
  const webId = _.kebabCase(req.params.id);
  blogPosts = Blog.find(function (err, posts) {
    //finds the fruits
    if (err) {
      //if there is error
      console.log(err);
    } else {
      posts.forEach(function (post) {
        //loop through posts
        const title = _.kebabCase(post.title);
        if (title === webId) {
          res.render("post", { post: post });
        }
      });
    }
  });
});

app.post("/delete", function (req, res) {
  const postID = req.body.deleteButton;
  Blog.findByIdAndDelete(postID, function (err) {});
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
