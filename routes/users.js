const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose");
const Post = require("./createdpost");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: [],
  },
  postId: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post", 
    },
  ],
});

userSchema.plugin(plm);

const User = mongoose.model("User", userSchema);
module.exports = User;
