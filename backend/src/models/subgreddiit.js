const mongoose = require("mongoose");
const {Schema} = mongoose;

const rejectionExpiryDays = 7;

const subgreddiitSchema = new Schema({
  title: {type: String, required: [true, "Title is required"], unique: true, minLength: [1, "Title is required"]},
  description: {type: String, required: [true, "Description is required"], minLength: [1, "Description is required"]},
  tags: [{
    type: String,
    minLength: [1, "Tag must contain one word"],
    match: [/^[^A-Z\s]+$/, "Tags must contain only one word with no uppercase characters."]
  }],
  bannedKeywords: [{
    type: String,
    minLength: [1, "Banned Keyword must contain one word."],
    match: [/^\S+$/, "Banned Keyword must contain only one word"]
  }],
  moderator: {type: Schema.Types.ObjectId, ref: "User", required: [true, "A moderator is required"]},
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  followRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
  blockedUsers: [{type: Schema.Types.ObjectId, ref: "User"}],
  rejectedUsers: [{
    rejectedUser: {type: Schema.Types.ObjectId, ref: "User"},
    rejectionExpiry: {type: Date, default: () => Date.now() + rejectionExpiryDays * 24 * 60 * 60 * 1000}
  }]

}, {timestamps: true})

const Subgreddiit = mongoose.model("Subgreddiit", subgreddiitSchema)

module.exports = Subgreddiit