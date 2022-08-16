const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CustumerBalanceSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Custumer",
    required: true,
  },
  created: { type: Date, default: Date.now },
  recharge: { type: Boolean, default: false },
  withdrawal: { type: Boolean, default: false }, //retrait d'argent
  amountRecharge: { type: Number, default: 0 },
  amountWithdrawal: { type: Number, default: 0 },
  amount: { type: Number, default: 0 }, //solde du client
});
module.exports = mongoose.model("CustumerBalance", CustumerBalanceSchema);
//module.exports = CustumerSchema;
