const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const vendorProposalOrderSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  vendorId: { type: Schema.Types.ObjectId, ref: "User" },
  retailerId: { type: Schema.Types.ObjectId, ref: "User" },
  commandes: [],
  created: { type: Date, default: Date.now },
  retailerConfirm: { type: Boolean, default: false },
  display: { type: Boolean, default: true },
  dateLivraison: String,
  delivered: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  livraisonDateConfirm: { type: Number, default: 0 },
});
vendorProposalOrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "vendorProposalOrder",
  vendorProposalOrderSchema
);
