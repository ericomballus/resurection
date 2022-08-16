const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

const childBillSchema = mongoose.Schema({
  adminId: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bill",
    required: true,
  },
  created: { type: Date, default: Date.now },
  invoicesId: String,
  userName: { type: String, default: "unknown" },
  reimbursed: { type: Number, default: 3 },
  openCashDate: Date,
  openCashDateId: String,
  commandes: [],
  numFacture: Number,
  montant: Number,
  localId: String,
  storeId: String,
  rembourse: Number,
  customerId: { type: String, default: "unknown" },
  trancheList: { type: Array, default: [] },
  cancel: { type: Boolean, default: false },
  delivery: { type: Boolean, default: false },
  confirmPaie: { type: Boolean, default: false },
  deleteAuth: { type: Boolean, default: false }, //demande de suppression
  toRemove: { type: Array, default: [] }, //les produits enlevés
  partiallyCancel: { type: Boolean, default: false },
  purchaseOrderConfirm: { type: Boolean, default: false },
  invoices: { type: Array, default: [] },
  billId: { type: String, default: null },
});
childBillSchema.plugin(mongoosePaginate);
module.exports = childBillSchema;
