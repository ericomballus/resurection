const mongoose = require("mongoose");

const refuelingSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  newquantity: { type: Number, default: 0 },
  senderId: String,
  storeId: String,
  id: String, //id du produit a mettre a jour
  adminId: String,
  confirm: { type: Boolean, default: false },
  name: String,
});

module.exports = refuelingSchema;
