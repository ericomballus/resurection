const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  name: String,
  created: { type: Date, default: Date.now },
  quantityItems: { type: Number, default: 0 },
  quantityInStore: { type: Number, default: 0 },
  confirm: { type: Boolean, default: false },
  idprod: String,
  sender: { type: String, default: "" },
  senderId: String,
  receiver: { type: String, default: "" },
  receiverId: String,
  productType: { type: String, default: "" },
  storeId: String,
  adminId: String,
});
//module.exports = mongoose.model("Transaction", transactionSchema);
module.exports = transactionSchema;
