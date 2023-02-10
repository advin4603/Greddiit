const mongoose = require("mongoose");
const {Schema} = mongoose;

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
    minLength: [1, "Tag must contain one word."],
    match: [/^\S+$/, "Keyword must contain only one word"]
  }],
  moderator: {type: Schema.Types.ObjectId, ref: "User", required: [true, "A moderator is required"]},
  followers: [{type: Schema.Types.ObjectId, ref: "User"}]

}, {timestamps: true})

const Subgreddiit = mongoose.model("Subgreddiit", subgreddiitSchema)

module.exports = Subgreddiit