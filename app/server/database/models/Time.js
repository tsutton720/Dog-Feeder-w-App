const mongoose = require("mongoose");

const TimeSchema = new mongoose.Schema({
  hour: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Time", TimeSchema);
