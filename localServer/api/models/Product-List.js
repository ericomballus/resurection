const mongoose = require("mongoose");
const tabitemSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  //prix total de l'achat
});

const productListSchema = mongoose.Schema({
  tabitem: [tabitemSchema],
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  sellingPriceMin: Number,
  retailerPrice: { type: Number, default: 0 },
  adminId: String,
  name: String,
  quantityItems: { type: Number, default: 0 },
  quantityStore: { type: Number, default: 0 },
  categoryName: String,
  produceBy: String,
  superCategory: String,
  productType: { type: String, default: "shoplist" },
  disablemanufactured: { type: Boolean, default: true },
  categoryIndicator: { type: String, default: "shoplist" },
  bottle_empty_Price: { type: Number, default: 0 },
  display: { type: Boolean, default: true },
  storeId: String,
  desabled: { type: Boolean, default: false },
  packSize: { type: Number, default: 1 },
  packPrice: { type: Number, default: 1 },
  categoryName: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categorie",
    // required: true,
  },
  quantityToConfirm: { type: Number, default: 0 },
  idList: { type: Array, default: [] }, //seulement id des produits
  quantityToAlert: { type: Number, default: 0 },
  acceptPrice: { type: Number, default: 0 },
  bottle_full: { type: Number, default: 0 }, //pour les vendeurs de gaz
  bottle_empty: { type: Number, default: 0 },
  bottle_total: { type: Number, default: 0 },
  container_info: { type: Object, default: { test: true } },
});

//module.exports = mongoose.model("Billard", billardSchema);
module.exports = productListSchema;
