const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const imageStoreSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  filename: String,
  originalName: String,
  adminId: String,
});
module.exports = mongoose.model("Images", imageStoreSchema);
