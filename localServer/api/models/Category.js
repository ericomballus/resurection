const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  adminId: String,
  created: { type: Date, default: Date.now },
  page: { type: String, default: "" },
});

//module.exports = mongoose.model("Category", categorySchema);
module.exports = categorySchema;
