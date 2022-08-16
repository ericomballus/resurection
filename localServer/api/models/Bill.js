const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const purchaseOrderSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  toRemove: { type: Array, default: [] },
  price: { type: Number, default: 0 },
});
const refundVoucherSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  productList: { type: Array, default: [] },
});
const billSchema = mongoose.Schema({
  adminId: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
  invoicesId: String,
  userName: { type: String, default: "unknown" },
  reimbursed: { type: Number, default: 3 },
  openCashDate: Date,
  openCashDateId: String,
  commandes: [],
  numFacture: { type: Number, default: 0 },
  montant: Number,
  localId: String,
  storeId: String,
  rembourse: Number,
  customerId: { type: String, default: "unknown" },
  customer: { type: Object, default: null },
  trancheList: { type: Array, default: [] },
  totalCancel: { type: Boolean, default: false },
  delivery: { type: Boolean, default: false },
  confirmPaie: { type: Boolean, default: false },
  purchaseOrder: [purchaseOrderSchema], //bon de commande
  refundVoucher: [refundVoucherSchema], //bon de remboursement
  deleteAuth: { type: Boolean, default: false }, //demande de suppression
  toRemove: { type: Array, default: [] }, //les produits enlevés
  partiallyCancel: { type: Boolean, default: false },
  purchaseOrderConfirm: { type: Boolean, default: false },
  invoices: { type: Array, default: [] },
  billId: { type: String, default: null },
  cancel: { type: Boolean, default: false },
  montantReduction: { type: Number, default: 0 },
  employeId: { type: String, default: null },
  commande: Object,
  paiment_type: { type: String, default: "CASH" },
  scConfirm: { type: Boolean, default: false }, //sc= super cashier
  swConfirm: { type: Boolean, default: false }, // le magasinier gestionnaire de stock
  saConfirm: { type: Boolean, default: false }, //sa= la dg confirm
  caisseConfirm: { type: Boolean, default: false },
  phoneNumber: { type: Number, default: 0 },
  useCustomerSolde: { type: Boolean, default: false },
  deliveryDate: String,
  emballage: { type: Number, default: 0 },
  phytosanitaire: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  taxeRetrait: { type: Number, default: 0 },
  poids_estimatif: { type: Number, default: 0 },
  transport_colis: { type: Number, default: 0 },
  removeProductList: { type: Array, default: [] },
  addProductList: { type: Array, default: [] },
  container_info: { type: Object, default: { test: true } },
});
billSchema.plugin(mongoosePaginate);
module.exports = billSchema;
