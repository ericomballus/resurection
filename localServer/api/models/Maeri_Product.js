const mongoose = require("mongoose");
const del = require("del");
const path = require("path");
let UPLOAD_PATH = "uploads";
const productSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: String,
  categoryName: String,
  capacity: String, // ou size
  created: { type: Date },
  updatedAt: { type: Date },
  filename: String,
  originalName: String,
  productImage: String,
  display: { type: Boolean, default: true },
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  sizeUnit: { type: Number, default: 0 },
  unitName: String,
  description: String,
  produceBy: String,
  packPrice: Number,
  packSize: Number,
  ristourne: Number,
  //category, shortName, quantityMin, sizeUnit, Actif(pour desactiver la donnée)
});

//midlleware here
productSchema.pre("save", function (next) {
  let now = Date.now();
  this.updatedAt = now;
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now;
  }

  next();
});
/*
productSchema.pre("remove", { query: true }, function(doc, next) {
  console.log("suppression du doc", doc);
  next();
});
*/
productSchema.pre("remove", { document: true }, function (next) {
  console.log("doc Removing doc!");
  next();
});

productSchema.pre("findOneAndRemove", { query: true }, function (next) {
  // console.log("suppression modelRemoving!");
  next();
});

//productSchema.plugin(mongoTenant);

module.exports = mongoose.model("ProductsMaeri", productSchema);
