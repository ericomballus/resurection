const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // $tenant: true
  },
  created: { type: Date, default: Date.now },
  reason: { type: String, default: " " },
  amount: { type: Number, default: 0 },
  categorieId: String,
  storeId: String,
  description: { type: String, default: " " },
  open: { type: Boolean, default: false },
  openCashDateId: String,
});
module.exports = ExpenseSchema;
