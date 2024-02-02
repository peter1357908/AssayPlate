const mongoose = require("mongoose");
const Plate = require("./PlateModel");

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

userSchema.pre("deleteOne", { document: true }, async function () {
  await Plate.deleteMany({ _id: { $in: this.plates} });
});

module.exports = mongoose.model("User", userSchema);