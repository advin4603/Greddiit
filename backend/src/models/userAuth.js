const mongoose = require("mongoose")
const {Schema} = mongoose

const userAuthSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User", unique: true},
  hash: {type: String, required: true}
})

const UserAuth = mongoose.model("UserAuth", userAuthSchema)

module.exports = UserAuth
