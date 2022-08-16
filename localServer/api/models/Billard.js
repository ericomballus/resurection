const mongoose = require("mongoose");
const tabitemSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  //prix total de l'achat
});
const billardSchema = mongoose.Schema({
  tabitem: [tabitemSchema],
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  superMarketPrice: { type: Number, default: 0 },
  randomPrice: { type: Number, default: 0 },
  sellingPriceMin: Number,
  retailerPrice: { type: Number, default: 0 },
  adminId: String,
  name: String,
  quantityItems: { type: Number, default: 0 },
  quantityStore: { type: Number, default: 0 },
  finis: { type: Number, default: 0 },
  semifinis: { type: Number, default: 0 },
  categoryName: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categorie",
    // required: true,
  },
  produceBy: String,
  superCategory: String,
  productType: { type: String, default: "billard" },
  disablemanufactured: { type: Boolean, default: true },
  categoryIndicator: { type: String, default: "billard" },
  sellingPrice: { type: Number, default: 0 },
  purchasingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  display: { type: Boolean, default: true },
  storeId: String,
  desabled: { type: Boolean, default: false },
  packSize: { type: Number, default: 1 },
  packPrice: { type: Number, default: 1 },
  bonus: { type: Number, default: 0 },
  originalname: String,
  filename: String,
  resourceList: { type: Array, default: [] },
  idList: { type: Array, default: [] }, //seulement id des produits
  quantityToAlert: { type: Number, default: 0 },
  masse: { type: Number, default: 0 },
  acceptPrice: { type: Number, default: 0 },
  bottle_full: { type: Number, default: 0 }, //pour les vendeurs de gaz
  bottle_empty: { type: Number, default: 0 },
  bottle_total: { type: Number, default: 0 },
  bottle_empty_Price: { type: Number, default: 0 },
  container_info: { type: Object, default: { test: true } },
});

//module.exports = mongoose.model("Billard", billardSchema);
module.exports = billardSchema;
