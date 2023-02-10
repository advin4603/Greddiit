const Subgreddiit = require("../models/subgreddiit")


async function createNewSubgreddiit({title, description, moderator}) {
  const newSubgreddiit = new Subgreddiit({title, description, moderator: moderator._id, followers: [moderator._id]})
  await newSubgreddiit.save()
  return newSubgreddiit;
}

async function addTag(subgreddiit, tag) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$addToSet: {tags: tag}})
}

async function addBannedKeyword(subgreddiit, bannedKeyword) {
  await Subgreddiit.updateOne({_id: subgreddiit._id}, {$addToSet: {bannedKeywords: bannedKeyword}})
}

async function findSubgreddiit(search) {
  const subgreddiit = await Subgreddiit.findOne(search).populate("followers", "username").populate("moderator", "username")
  return subgreddiit;
}

async function updateSubgreddiit(subgreddiit, update) {
  await Subgreddiit.findOneAndUpdate({_id: subgreddiit._id}, update)
}

async function getModeratedSubgreddiits(user) {
  return Subgreddiit.find({moderator: user._id});
}

async function deleteSubgreddiit(subgreddiit) {
  await Subgreddiit.deleteOne({_id: subgreddiit._id})
}

module.exports = {
  createNewSubgreddiit,
  addTag,
  addBannedKeyword,
  findSubgreddiit,
  updateSubgreddiit,
  getModeratedSubgreddiits,
  deleteSubgreddiit
}
