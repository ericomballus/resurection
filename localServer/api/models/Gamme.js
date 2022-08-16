const mongoose = require("mongoose");

const gammeSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  adminId: String,
  name: String,
  sellingPrice: { type: Number, default: 0 },
  desabled: { type: Boolean, default: false },
  productList: { type: Array, default: [] },
  productType: { type: String, default: "Gamme" },
  originalname: String,
  filename: String,
  newUrl: String,
  storeId: String,
  acceptPrice: { type: Number, default: 0 },
});

module.exports = gammeSchema;
