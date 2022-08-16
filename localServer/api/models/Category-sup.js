const mongoose = require("mongoose");

const supcategorySchema = mongoose.Schema({
  name: String,
  adminId: String,
  created: { type: Date, default: Date.now },
});
//module.exports = mongoose.model("superCategory", supcategorySchema);
module.exports = supcategorySchema;
