const mongoose = require("mongoose");
const del = require("del");
const path = require("path");
let UPLOAD_PATH = "uploads";

const productitems_manufacturedSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // $tenant: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    //$tenant: true
  },
  categoryName: String,
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  // capacity: String, // ou size
  created: { type: Date },
  updatedAt: { type: Date },
  filename: String,
  originalName: String,
  productImage: String,
  description: String,
  sellingPrice: { type: Number, default: 0 },
  purchasingPrice: { type: Number, default: 0 },
  retailerPrice: { type: Number, default: 0 },
  actif: { type: Boolean, default: true },
  quantityMin: { type: Number, default: 0 },
  resourceList: { type: Array, default: [] },
  produceBy: String,
  url: String,
  maeriId: String,
  source: String,
  disablemanufactured: { type: Boolean, default: true },
  confirm: { type: Boolean, default: false },
  sender: String,
  receiver: String,
  superCategory: String,
  desabled: { type: Boolean, default: false },
  categoryIndicator: { type: String, default: "plat" },
  storeId: String,
  size: { type: String, default: "1" },
  acceptPrice: { type: Number, default: 0 },
});

//midlleware here
productitems_manufacturedSchema.pre("save", function (next) {
  let now = Date.now();
  this.updatedAt = now;
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now;
  }

  next();
});

productitems_manufacturedSchema.pre(
  "remove",
  { document: true },
  function (next) {
    console.log("doc Removing doc!");
    next();
  }
);
/*
productitems_manufacturedSchema.pre(
  "findOneAndRemove",
  { query: true },
  function (next) {
    console.log("suppression modelRemoving!");
    next();
  }
); */
/*
productitems_manufacturedSchema.post("findOneAndRemove", function (doc, next) {
  console.log("post2", doc);

  del([path.join(UPLOAD_PATH, doc.filename)]).then((deleted) => {
    console.log("image delete", deleted);
  });

  next();
  s;
});  */
/*
module.exports = mongoose.model(
  "manufacturedUserSchema",
  productitems_manufacturedSchema
);*/
module.exports = productitems_manufacturedSchema;
