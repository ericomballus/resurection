const mongoose = require("mongoose");

const madebySchema = mongoose.Schema({
  name: String,
  adminId: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Madeby", madebySchema);
