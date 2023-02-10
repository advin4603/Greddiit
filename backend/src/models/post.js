const mongoose = require("mongoose");
const {Schema} = mongoose;

const postSchema = new Schema({
  title: {type: String, required: [true, "Title is required"], unique: true, minLength: [1, "Title is required"]},
  post: {type: String, required: [true, "Description is required"], minLength: [1, "Post is required"]},
  postedBy: {type: Schema.Types.ObjectId, ref: "User", required: [true, "A Poster is required"]},
  postedIn: {type: Schema.Types.ObjectId, ref: "Subgreddiit", required: [true, "A Posted in is required"]},
  upvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
  downvotes: [{type: Schema.Types.ObjectId, ref: "User"}],

}, {timestamps: true})

const Post = mongoose.model("Post", postSchema)

module.exports = Post