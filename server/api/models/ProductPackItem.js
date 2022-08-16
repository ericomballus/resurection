const mongoose = require("mongoose");
const pack_items_update_Schema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  //prix total de l'achat
});
const myproductpackitemSchema = mongoose.Schema({
  packId: { type: mongoose.Schema.Types.ObjectId, ref: "productPack" },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },

  productPackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  url: String,
  created: { type: Date, default: Date.now },
  dateupdate: { type: Date, default: Date.now },
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  sellingPackPrice: { type: Number, default: 1 },
  adminId: String,
  thetype: { type: String, default: "packitems" },
  name: String,
  pack_update: [pack_items_update_Schema],
  productType: { type: String, default: " packItems" },
  quantityItems: { type: Number, default: 0 },
  itemsInPack: Number,
  unitNameProduct: String,
  sizeUnitProduct: Number,
  maeriId: String,
  categoryName: String,
  superCategory: String,
  categoryIndicator: { type: String, default: "boisson" },
  storeId: String,
  desabled: { type: Boolean, default: false },
});

//module.exports = mongoose.model("packitem", myproductpackitemSchema);
module.exports = myproductpackitemSchema;

// mettre en place le multitenancy, mongoose-history
