const Post = require("../models/post")
const Report = require("../models/report")
const Comment = require("../models/comment")

async function createNewPost({title, post, postedBy, postedIn}) {
  const newPost = new Post({title, post, postedBy: postedBy._id, postedIn: postedIn._id})
  await newPost.save()
  return newPost;
}

async function updatePost(post, update) {
  return Post.findOneAndUpdate({_id: post._id}, update)
}

async function deletePost(post) {
  await Promise.all([
    Post.deleteOne({_id: post._id}),
    Report.deleteMany({post: post._id}),
    Comment.deleteMany({commentedOn: post._id})
  ])
}

async function findPostID(id, populate_subggreddiit_with_title = true) {
  if (populate_subggreddiit_with_title)
    return Post.findById(id).populate("postedBy", "username").populate("postedIn", "title").populate("upvotes", "username").populate("downvotes", "username")
  return Post.findById(id).populate("postedBy", "username").populate("postedIn").populate("upvotes", "username").populate("downvotes", "username")
}

async function getPostsInSubgreddiit(subgreddiit) {
  return Post.find({postedIn: subgreddiit._id}).populate("postedBy", "username").populate("postedIn", "title").populate("upvotes", "username").populate("downvotes", "username")
}

async function upvote(post, user) {
  return Post.updateOne({_id: post._id}, {
    $addToSet: {upvotes: user._id}, $pull: {downvotes: user._id}
  })
}

async function downvote(post, user) {
  return Post.updateOne({_id: post._id}, {
    $addToSet: {downvotes: user._id}, $pull: {upvotes: user._id}
  })
}

async function removeVote(post, user) {
  return Post.updateOne({_id: post._id}, {
    $pull: {downvotes: user._id, upvotes: user._id},
  })
}

function censor(text, bannedKeywords) {
  for (const bannedKeyword of bannedKeywords) {
    let regex = new RegExp(bannedKeyword, "ig")
    text = text.replaceAll(regex, "*".repeat(bannedKeyword.length))
  }
  return text
}

module.exports = {
  createNewPost, updatePost, deletePost, findPostID, getPostsInSubgreddiit, upvote, downvote, removeVote, censor
}
