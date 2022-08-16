const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const retailerOrderSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  vendorId: { type: Schema.Types.ObjectId, ref: "User" },
  retailerId: { type: Schema.Types.ObjectId, ref: "User" },
  commandes: [],
  created: { type: Date, default: Date.now },
  vendorConfirm: { type: Boolean, default: false },
  orderConfirm: { type: Boolean, default: false },
  dateLivraison: String,
  delivered: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  livraisonDateConfirm: { type: Number, default: 0 },
  maxChanges: {
    type: Number,
    default: 0,
  },
  isBuy: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 1,
  } /*1= en attente, 2= en traitement, 3= marchandise livré, 4= livraison reçu */,
});
retailerOrderSchema.plugin(mongoosePaginate);
const retailerOrder = mongoose.model(
  "retailerOrder",
  retailerOrderSchema,
  "retailerOrder"
);
retailerOrder.on("change", (data) => {
  console.log(new Date(), data);
});

module.exports = mongoose.model("retailerOrder", retailerOrderSchema);
