const mongoose = require("mongoose");
const {Schema} = mongoose;

const commentSchema = new Schema({
  comment: {type: String, required: [true, "Comment is required"], minLength: [1, "Comment is required"]},
  commentedBy: {type: Schema.Types.ObjectId, ref: "User", required: [true, "A Commenter is required"]},
  commentedOn: {type: Schema.Types.ObjectId, ref: "Post", required: [true, "A Commented on is required"]},
  commentedIn: {type: Schema.Types.ObjectId, ref: "Subgreddiit", required: [true, "A Commented in is required"]},
  upvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
  downvotes: [{type: Schema.Types.ObjectId, ref: "User"}],

}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment