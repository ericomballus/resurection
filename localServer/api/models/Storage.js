const mongoose = require("mongoose");

const StorageSchema = mongoose.Schema({
  url: String,
  created: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
  data: Object,
  method: String,
});

module.exports = mongoose.model("Storage", StorageSchema);
