const mongoose = require("mongoose");

const observerSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  adminId: String,
  newProduct: { type: Boolean, default: false },
  purchase: { type: Boolean, default: false },
  store: { type: Object, default: {} },
  desabled: { type: Boolean, default: false },
  storeId: String,
});

module.exports = observerSchema;
