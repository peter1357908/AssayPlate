const mongoose = require("mongoose");

const plateSchema = new mongoose.Schema({
  plateName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
  nRow: {
    type: Number,
    required: true,
    min: 1,
    max: 24,
  },
  nCol: {
    type: Number,
    required: true,
    min: 1,
    max: 16,
  },
  wells: [{
    reagent: { type: String },
    antibody: { type: String },
    concentration: { type: Number },
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Plate", plateSchema);