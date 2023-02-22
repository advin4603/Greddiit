const Comment = require("../models/comment")

async function createNewComment({comment, post, user}) {
  const newComment = new Comment({
    comment,
    commentedBy: user._id,
    commentedOn: post._id,
    commentedIn: post.postedIn._id
  })
  await newComment.save()
  return newComment;
}

async function findCommentID(id) {
  return Comment.findById(id)
    .populate("commentedOn")
}


async function getCommentsOnPost(post) {
  return Comment.find({commentedOn: post._id})
    .populate("commentedBy", "username")
    .populate("upvotes", "username")
    .populate("downvotes", "username")
}

async function upvote(comment, user) {
  return Comment.updateOne({_id: comment._id}, {
    $addToSet: {upvotes: user._id}, $pull: {downvotes: user._id}
  })
}

async function downvote(comment, user) {
  return Comment.updateOne({_id: comment._id}, {
    $addToSet: {downvotes: user._id}, $pull: {upvotes: user._id}
  })
}

async function removeVote(comment, user) {
  return Comment.updateOne({_id: comment._id}, {
    $pull: {downvotes: user._id, upvotes: user._id},
  })
}


module.exports = {
  createNewComment,
  getCommentsOnPost,
  upvote,
  downvote,
  removeVote,
  findCommentID
}