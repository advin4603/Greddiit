const mongoose = require("mongoose");
const {Schema} = mongoose;

const reportSchema = new Schema({
  concern: {type: String, required: [true, "Concern is required"], minLength: [1, "Concern is required"]},
  reporter: {type: Schema.Types.ObjectId, ref: "User", required: [true, "A Reporter is required"]},
  reportedIn: {type: Schema.Types.ObjectId, ref: "Subgreddiit", required: [true, "A Reported in is required"]},
  post: {type: Schema.Types.ObjectId, ref: "Post", required: [true, "A Post in is required"]},
  ignored: {type: Boolean, default: false},
  blocked: {type: Boolean, default: false},
}, {timestamps: true})

const Report = mongoose.model("Report", reportSchema)

module.exports = Report