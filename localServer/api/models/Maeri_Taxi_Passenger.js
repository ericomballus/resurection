const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const maeriTaxiPassengerSchema = new mongoose.Schema({
  customer_phone: Number,
  name: String,
  created: { type: Date },
});

module.exports = mongoose.model("taxiPassenger", maeriTaxiPassengerSchema);
