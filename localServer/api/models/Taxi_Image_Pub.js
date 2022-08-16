const mongoose = require("mongoose");
const del = require("del");
const path = require("path");
const TaxiImagePubSchema = new mongoose.Schema({
  name: String,
  created: { type: Date },
  updatedAt: { type: Date },
  filename: String,
  originalName: String,
  // productImage: String,
  display: { type: Boolean, default: true },
});

//midlleware here
TaxiImagePubSchema.pre("save", function (next) {
  console.log("pre mongoose midlleware");
  let now = Date.now();
  this.updatedAt = now;
  if (!this.created) {
    this.created = now;
  }

  next();
});

TaxiImagePubSchema.pre("remove", { document: true }, function (next) {
  console.log("doc Removing doc!");
  next();
});

TaxiImagePubSchema.pre("findOneAndRemove", { query: true }, function (next) {
  next();
});

module.exports = mongoose.model("TaxiImagePub", TaxiImagePubSchema);
