const User = require("../models/user")


async function findUser(search) {
  const user = await User.findOne(search, "-savedPosts").populate("followers", "username").populate("following", "username");
  return user;
}

async function createNewUser({username, firstName, lastName, email, age, contactNumber}) {
  const newUser = new User({username, firstName, lastName, email, age, contactNumber})
  await newUser.save();
  return newUser
}

async function addSavedPost(username, post) {
  return User.updateOne({username}, {$addToSet: {savedPosts: post._id}})
}

async function removeSavedPost(username, postID) {
  return User.updateOne({username}, {$pull: {savedPosts: postID}})
}

async function getSavedPostsIDs(username) {
  const user = await User.findOne({username})
  return user.savedPosts
}

async function followUser(follower, toBeFollowed) {
  await Promise.all([
    User.updateOne({_id: follower._id}, {$addToSet: {following: toBeFollowed._id}}),
    User.updateOne({_id: toBeFollowed._id}, {$addToSet: {followers: follower._id}})
  ])
}

async function unfollowUser(unfollower, toBeUnfollowed) {
  await Promise.all([
    User.updateOne({_id: unfollower._id}, {$pull: {following: toBeUnfollowed._id}}),
    User.updateOne({_id: toBeUnfollowed._id}, {$pull: {followers: unfollower._id}})
  ])
}

async function updateUser(username, update) {
  await User.findOneAndUpdate({username}, update)
}

module.exports = {
  createNewUser,
  findUser,
  updateUser,
  followUser,
  unfollowUser,
  addSavedPost,
  removeSavedPost,
  getSavedPostsIDs
}