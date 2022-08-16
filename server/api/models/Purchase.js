const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const purchaseSchema = mongoose.Schema({
  purchaseDate: Date,
  adminId: String,
  quantity: Number,
  totalPrice: Number,
  hours: String,
  storeId: String,
  senderId: String,
  articles: Array,
  created: { type: Date, default: Date.now },
  desable: { type: Boolean, default: false },
  AgenceCommande: { type: Array, default: [] },
  scConfirm: { type: Boolean, default: false }, //sc= super cashier
  swConfirm: { type: Boolean, default: false },
  saConfirm: { type: Boolean, default: false }, //sa= la dg confirm
  managerConfirm: { type: Boolean, default: false }, //chef d'agence coonfirm la livraison
  delivery: { type: Boolean, default: false },
  ischecked: { type: Boolean, default: false }, //gaz option
  wareHouseRefueling: { type: Boolean, default: false },
});
purchaseSchema.plugin(mongoosePaginate);
module.exports = purchaseSchema;
