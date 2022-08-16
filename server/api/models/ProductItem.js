const mongoose = require("mongoose");
var Schema = mongoose.Schema;
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

const ristourneTabSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  openCashDateId: String,
  openCashDate: { type: Date },
  ristourne: { type: Number },
});

const noRistouneSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  quantity: { type: Number, default: 0 },
});

const productItemSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: { type: Schema.Types.ObjectId, ref: "products" },
  name: String,
  capacity: String, // ou size
  created: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  description: String,
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  tabitem: [tabitemSchema],
  testTab: [],
  quantityItems: { type: Number, default: 0 },
  quantityStore: { type: Number, default: 0 },
  quantityToConfirm: { type: Number, default: 0 },
  quantityToAlert: { type: Number, default: 0 },
  noRistourne: [noRistouneSchema] /*les achats sans ristourne*/,
  stockNoRistourne: {
    type: Number,
    default: 0,
  } /*quantité d'articles sans ristoune*/,
  ristourneGenerate: {
    type: Number,
    default: 0,
  } /*la somme des ristourne généré*/,
  ristourneTab: [ristourneTabSchema],
  beneficeTotal: {
    type: Number,
    default: 0,
  } /* benefice genéré par le produit*/,
  confirmStore: { type: Number, default: 0 },
  consigne: { type: Number, default: 0 },
  glace: { type: Number, default: 0 },
  nonglace: { type: Number, default: 0 },
  url: String,
  productType: { type: String, default: "productItems" },
  thetype: { type: String, default: "productItems" },
  productAlert: { type: Boolean, default: true },
  unitNameProduct: String,
  sizeUnitProduct: Number,
  maeriId: String,
  produceBy: { type: String, default: "Company" },
  packSize: Number,
  packPrice: Number,
  sellingPackPrice: { type: Number, default: 1 },
  categoryName: String,
  superCategory: String,
  storeId: String,
  categoryIndicator: { type: String, default: "boisson" },
  ristourne: Number,
  ristourneParProduit: Number,
  itemStoreId: String,
  desabled: { type: Boolean, default: false },
  resourceList: { type: Array, default: [] },
  acceptPrice: { type: Number, default: 0 },
});

module.exports = productItemSchema;
//module.exports = mongoose.model("productitem", productItemSchema);
