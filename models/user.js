const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  about: {
    type: String,
    required: false,
    default: null,
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cart:{
    type: Array,
    required: false,
    default:[]
  }
});

module.exports = mongoose.model("User", userSchema);
