const mongoose = require("mongoose");

const categoryMaeriSchema = mongoose.Schema({
  name: String,
  adminId: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MaeriCategory", categoryMaeriSchema);

//module.exports = categorySchema;
