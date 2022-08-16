const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const productionTransactionSchema = new mongoose.Schema({
  name: String,
  created: { type: Date, default: Date.now },
  quantity: { type: Number, default: 0 },
  quantityInStock: { type: Number, default: 0 },
  productId: String,
  sender: { type: String, default: "" },
  // employeId: String,
  adminId: String,
  employeId: [{ type: Schema.Types.ObjectId, ref: "Employe" }],
});
module.exports = mongoose.model(
  "ProductionTransaction",
  productionTransactionSchema
);
//module.exports = productionTransactionSchema;
