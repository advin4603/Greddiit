const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    match: [/^[\w\s-]+$/, "Username can only contain letters, numbers, hyphens and spaces"],
    minLength: [1, "Username is required"]
  },
  firstName: {type: String, required: [true, "First Name is required"], minLength: [1, "First Name is required"]},
  lastName: {type: String, required: [true, "Last Name is required"], minLength: [1, "Last Name is required"]},
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    minLength: [1, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email"]
  },
  age: {type: Number, required: [true, "Age is required"], min: [13, "User must be older than 12"]},
  contactNumber: {
    type: String,
    required: [true, "Contact Number is required"],
    minLength: [1, "Contact Number is required"],
    match: [/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, "Invalid Contact Number"]
  },
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
  savedPosts: [{type: Schema.Types.ObjectId, ref: "Post"}]

}, {timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User