const mongoose = require("mongoose");

const pack_items_Schema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  url: String,
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  adminId: String,
  thetype: { type: String, default: "productitem" },
  //prix total de l'achat
});

const PackSchema = mongoose.Schema({
  productItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productItem",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  name: String,
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  sellingPackPrice: { type: Number, default: 1 },
  url: String,
  adminId: String,
  //quantity: ,
  pack_items: [pack_items_Schema],
  unitNamePack: String,
  unitNameProduct: String,
  sizeUnitProduct: Number,
  sizePack: Number,
  thetype: { type: String, default: "pack" },
  maeriId: String,
  categoryName: String,
  superCategory: String,
  categoryIndicator: { type: String, default: "boisson" },
  storeId: String,
  desabled: { type: Boolean, default: false },
});

//module.exports = mongoose.model("productPack", PackSchema);
module.exports = PackSchema;
