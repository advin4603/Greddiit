const Subgreddiit = require("../models/subgreddiit")
const Post = require("../models/post")

async function createNewSubgreddiit({title, description, moderator}) {
  const newSubgreddiit = new Subgreddiit({title, description, moderator: moderator._id, followers: [moderator._id]})
  await newSubgreddiit.save()
  return newSubgreddiit;
}

async function addTag(subgreddiit, tag) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$addToSet: {tags: tag}})
}

async function removeTag(subgreddiit, tag) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$pull: {tags: tag}})
}

async function addBannedKeyword(subgreddiit, bannedKeyword) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$addToSet: {bannedKeywords: bannedKeyword}})
}

async function removeBannedKeyword(subgreddiit, bannedKeyword) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$pull: {bannedKeywords: bannedKeyword}})
}

function createSubgreddiitFollowerView(subgreddiit) {
  return {
    title: subgreddiit.title,
    description: subgreddiit.description,
    tags: subgreddiit.tags,
    bannedKeywords: subgreddiit.bannedKeywords,
    moderator: subgreddiit.moderator,
    followers: subgreddiit.followers,
    createdAt: subgreddiit.createdAt,
    blockedUsers: subgreddiit.blockedUsers,
    exFollowers: subgreddiit.exFollowers
  }
}

function createSubgreddiitOutsiderView(subgreddiit, username) {
  return {
    title: subgreddiit.title,
    description: subgreddiit.description,
    tags: subgreddiit.tags,
    moderator: subgreddiit.moderator,
    requested: subgreddiit.followRequests.filter((follower) => (follower.username === username)).length !== 0,
    blocked: subgreddiit.blockedUsers.filter((blocked) => (blocked.username === username)).length !== 0,
    exFollower: subgreddiit.exFollowers.filter((follower) => (follower.username === username)).length !== 0,
    rejections: subgreddiit.rejectedUsers.filter(({
                                                    rejectedUser,
                                                    rejectionExpiry
                                                  }) => (rejectedUser.username === username)),
    followerCount: subgreddiit.followers.length,
    createdAt: subgreddiit.createdAt
  }
}

async function findSubgreddiit(search) {
  const subgreddiit = await Subgreddiit
    .findOne(search)
    .populate("followers", "username")
    .populate("moderator", "username")
    .populate("followRequests", "username")
    .populate("blockedUsers", "username")
    .populate({path: "rejectedUsers", populate: {path: "rejectedUser", select: "username"}})
  return subgreddiit;
}

async function updateSubgreddiit(subgreddiit, update) {
  await Subgreddiit.findOneAndUpdate({_id: subgreddiit._id}, update)
}

async function getModeratedSubgreddiits(user) {
  return Subgreddiit.find({moderator: user._id});
}

async function deleteSubgreddiit(subgreddiit) {
  return Promise.all([Subgreddiit.deleteOne({_id: subgreddiit._id}), Post.deleteMany({postedIn: subgreddiit._id})])
}

async function requestSubgreddiitJoin(subgreddiit, user) {
  return Subgreddiit.updateOne({_id: subgreddiit._id}, {$addToSet: {followRequests: user._id}})
}

async function approveSubgreddiitJoin(subgreddiit, user) {
  return Subgreddiit.updateOne({_id: subgreddiit._id}, {
    $pull: {followRequests: user._id},
    $addToSet: {followers: user._id}
  })
}

async function rejectSubgreddiitJoin(subgreddiit, user) {
  return Subgreddiit.updateOne({_id: subgreddiit._id}, {
    $pull: {followRequests: user._id},
    $addToSet: {rejectedUsers: {rejectedUser: user._id}}
  })
}

module.exports = {
  createNewSubgreddiit,
  addTag,
  addBannedKeyword,
  removeTag,
  removeBannedKeyword,
  findSubgreddiit,
  updateSubgreddiit,
  getModeratedSubgreddiits,
  deleteSubgreddiit,
  requestSubgreddiitJoin,
  approveSubgreddiitJoin,
  rejectSubgreddiitJoin,
  createSubgreddiitOutsiderView,
  createSubgreddiitFollowerView
}
