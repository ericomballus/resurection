const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const custumerTransactionSchema = new mongoose.Schema({
  //cashId
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaxiDriver",
    required: true,
  },
  cashId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "taxicashOpen",
    // required: true,
  },
  customer_phone: Number,
  driver_phone: Number,
  provider: String,
  created: { type: Date, default: Date.now },
  cash: Number,
  open: { type: Boolean, default: true },
});

module.exports = mongoose.model(
  "passengerTransaction",
  custumerTransactionSchema
);
