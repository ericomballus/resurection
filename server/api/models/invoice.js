const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const invoiceSchema = mongoose.Schema({
  // _iduser: mongoose.Schema.Types.ObjectId,
  // adminId: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commande: Object,
  commandes: [],
  ristourneProd: [],
  created: { type: Date, default: Date.now },
  confirm: { type: Boolean, default: false },
  Posconfirm: { type: Boolean, default: false },
  products: Object,
  sale: { type: Boolean, default: false },
  userName: { type: String, default: "unknown" },
  custumerName: String,
  custumerPhone: String,
  tableNumber: Number,
  validUntil: Date,
  openCashDate: Date,
  openCashDateId: String,
  avance: { type: Number, default: 0 },
  reste: { type: Number, default: 0 },
  invoiceCancel: { type: Boolean, default: false },
  onAccount: { type: Boolean, default: false },
  partially: { type: Boolean, default: false },
  cash: { type: Boolean, default: false },
  isRetailer: { type: Boolean, default: false },
  returnProduct: { type: Boolean, default: false },
  deleteAuth: { type: Boolean, default: false },
  motif: String,
  numFacture: { type: Number, default: 0 },
  localId: String,
  billId: String,
  senderId: String,
  resourceList: { type: Array, default: [] },
  storeId: String,
  customerId: { type: String, default: "" },
  trancheList: { type: Array, default: [] },
  delivery: { type: Boolean, default: false },
  confirmPaie: { type: Boolean, default: false },
  purchaseOrder: { type: Array, default: [] }, //bon de commande
  refundVoucher: { type: Array, default: [] }, //bon de remboursement
  montantReduction: { type: Number, default: 0 },
  employeId: { type: String, default: null },
  paiment_type: { type: String, default: "CASH" },
  scConfirm: { type: Boolean, default: false }, //sc= super cashier
  swConfirm: { type: Boolean, default: false },
  caisseConfirm: { type: Boolean, default: false },
  saConfirm: { type: Boolean, default: false }, //sa= la dg confirm
  phoneNumber: { type: Number, default: 0 },
  useCustomerSolde: { type: Boolean, default: false },
  deliveryDate: String,
  emballage: { type: Number, default: 0 },
  phytosanitaire: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  taxeRetrait: { type: Number, default: 0 },
  poids_estimatif: { type: Number, default: 0 },
  SM: { type: Boolean, default: false }, // supermarché
  transport_colis: { type: Number, default: 0 },
  removeProductList: { type: Array, default: [] },
  addProductList: { type: Array, default: [] },
  valide: { type: Boolean, default: false },
  container_info: { type: Object, default: { test: true } },
});
invoiceSchema.plugin(mongoosePaginate);
module.exports = invoiceSchema;
//module.exports = mongoose.model("Invoice", invoiceSchema);

//module.exports = mongoose.model("superCategory", supcategorySchema);
