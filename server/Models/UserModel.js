const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
  },
  plates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plate" }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("User", userSchema);