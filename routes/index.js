var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./createdpost");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { nav: false, error: req.flash("error") });
});

router.get("/register", function (req, res) {
  res.render("register", { nav: false });
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("postId");
  console.log(loggedInUser);
  res.render("profile", { loggedInUser, nav: true });
});

router.get("/show/posts", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("postId");
  console.log(loggedInUser);
  res.render("show", { loggedInUser, nav: true });
});

router.get("/feed", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel.findOne({
    username: req.session.passport.user,
  });
  const posts = await postModel.find().populate("loggedUserId");
  // console.log(posts);
  res.render("feed", { loggedInUser, posts, nav: true });
});

router.get("/add", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("add", { nav: true });
});

router.post("/register", function (req, res) {
  const userData = new userModel({
    username: req.body.username,
    name: req.body.fullName,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
    failureFlash: true,
  }),
  function (req, res, next) {}
);

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("profileimg"),
  async function (req, res, next) {
    const loggedInUser = await userModel.findOne({
      username: req.session.passport.user,
    });
    loggedInUser.profileImage = req.file.filename;
    res.redirect("/profile");
  }
);

router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postImage"),
  async function (req, res) {
    const loggedInUser = await userModel.findOne({
      username: req.session.passport.user,
    });
    const newPost = await postModel.create({
      loggedUserId: loggedInUser._id,
      postTitle: req.body.title,
      postCaption: req.body.caption,
      newPostedImage: req.file.filename,
    });

    loggedInUser.postId.push(newPost._id);
    await loggedInUser.save();
    res.redirect("/profile");
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
