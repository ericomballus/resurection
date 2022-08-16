const mongoose = require("mongoose");
const tabitemSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  month: { type: Number, default: new Date().getMonth() },
  year: { type: Number, default: new Date().getFullYear() },
  quantity: { type: Number, default: 0 },
  quantityOut: { type: Number, default: 0 },
  stockInit: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  motif: { type: String, default: "achat" },
  itemId: String,
  more: { type: Number, default: 0 },
});
const productmanufactureditemSchema = mongoose.Schema({
  // productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product_manufactured" },
  //  _id: mongoose.Schema.Types.ObjectId,
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product_manufactured",
    required: true,
  },
  url: String,
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  adminId: String,
  thetype: { type: String, default: "packitems" },
  name: String,
  tabitem: [tabitemSchema],
  productType: { type: String, default: "manufacturedItems" },
  quantityItems: { type: Number, default: 0 },
  quantityStore: { type: Number, default: 0 },
  resourceList: { type: Array, default: [] },
  categoryName: String,
  produceBy: String,
  url: String,
  maeriId: String,
  source: String,
  superCategory: String,
  disablemanufactured: { type: Boolean, default: true },
  categoryIndicator: { type: String, default: "plat" },
  storeId: String,
  confirmStore: { type: Number, default: 0 },
  desabled: { type: Boolean, default: false },
  size: { type: String, default: "1" },
});

productmanufactureditemSchema.post("create", function (doc, next) {
  console.log("hellolll");
  console.log("docs here", doc);
  next();
});
/*
module.exports = mongoose.model(
  "C",
  productmanufactureditemSchema
);*/

module.exports = productmanufactureditemSchema;

// mettre en place le multitenancy, mongoose-history
