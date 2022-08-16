const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TaxiDriverSchema = mongoose.Schema({
  name: String,
  first_name: String,
  password: String,
  matricule: String,
  phone: Number,
  phoneOrange: Number,
  phoneMtn: Number,
  created: { type: Date, default: Date.now },
  filename: String,
  originalName: String,
  qrCode: String,
  urlQrcode: String,
});

module.exports = mongoose.model("TaxiDriver", TaxiDriverSchema);
