const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

const PurchaseOrderSchema = mongoose.Schema({
  adminId: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billId: String,
  created: { type: Date, default: Date.now },
  toRemove: { type: Array, default: [] },
  price: { type: Number, default: 0 },
  managerSend: { type: Boolean, default: true },
  posConfirm: { type: Boolean, default: false },
  customerId: String,
  storeId: String,
  reste: { type: Number, default: 0 },
  repaymentWithCash: { type: Boolean, default: false },
  repaymentWithOtherProducts: { type: Boolean, default: false },
  returnProduct: { type: Boolean, default: false },
  openCashDateId: String,
});
PurchaseOrderSchema.plugin(mongoosePaginate);
module.exports = PurchaseOrderSchema;
