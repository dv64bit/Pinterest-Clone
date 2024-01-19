const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const createdPostSchema = Schema({
  loggedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  postTitle: String,
  postCaption: String,
  newPostedImage: String,
});

const Post = mongoose.model("Post", createdPostSchema);
module.exports = Post;
