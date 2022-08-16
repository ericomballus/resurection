const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const resourceSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  adminId: String,
  name: String,
  unitName: String,
  sizeUnit: { type: Number, default: 0 },
  unitName: String,
  packSize: Number,
  storeId: String,
  sellingPrice: { type: Number, default: 0 },
  purchasingPrice: { type: Number, default: 0 },
  desabled: { type: Boolean, default: false },
  product: { type: Boolean, default: false },
  page: { type: String, default: "" },
});
//tous les champs sont obligatoires
//module.exports = mongoose.model("Resource", resourceSchema);
module.exports = resourceSchema;
