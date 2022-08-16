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
const resourceitemSchema = mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
  tabitem: [tabitemSchema],
  created: { type: Date, default: Date.now },
  adminId: String,
  name: String,
  unitName: String,
  quantityItems: { type: Number, default: 0 },
  quantityStore: { type: Number, default: 0 },
  storeId: String,
  desabled: { type: Boolean, default: false },
  quantity: { type: Number, default: 0 },
  oldstock: { type: Number, default: 0 },
  newstock: { type: Number, default: 0 },
  resourceType: { type: Boolean, default: true },
  sizeUnit: { type: Number, default: 1 },
  sellingPrice: { type: Number, default: 0 },
  purchasingPrice: { type: Number, default: 0 },
  desabled: { type: Boolean, default: false },
  packSize: Number,
  storeId: String,
  product: { type: Boolean, default: false },
  page: { type: String, default: "" },
});
//tous les champs sont obligatoires
//module.exports = mongoose.model("Resourceitem", resourceitemSchema);
module.exports = resourceitemSchema;
