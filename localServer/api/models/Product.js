const mongoose = require("mongoose");
const del = require("del");
const path = require("path");
let UPLOAD_PATH = "uploads";

const productSchema = new mongoose.Schema({
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
  name: String,
  capacity: String, // ou size
  created: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  filename: String,
  originalName: String,
  productImage: String,
  description: String,
  purchasingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },

  actif: { type: Boolean, default: true },
  quantityMin: { type: Number, default: 0 },
  maxproduct: { type: Number, default: 50 },
  sizeUnit: { type: Number, default: 0 },
  unitName: String,
  display: { type: Boolean, default: true },
  url: String,
  maeriId: { type: String, default: "nothing" },
  produceBy: { type: String, default: "Company" },
  ristourne: Number,
  productId: String,
  packSize: { type: Number, default: 1 },
  packPrice: { type: Number, default: 1 },
  sellingPackPrice: { type: Number, default: 1 },
  retailerPrice: { type: Number, default: 0 },
  categoryName: String,
  superCategory: String,
  categoryIndicator: { type: String, default: "boisson" },
  storeId: String,
  quantityToAlert: { type: Number, default: 0 },
  desabled: { type: Boolean, default: false },
  resourceList: { type: Array, default: [] },
  acceptPrice: { type: Number, default: 0 },
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
  console.log("suppression modelRemoving!");
  next();
});

productSchema.post("findOneAndRemove", function (doc, next) {
  console.log("post2", doc);

  del([path.join(UPLOAD_PATH, doc.filename)]).then((deleted) => {
    console.log("image delete", deleted);
    /* res.status(200).json({ message: "image supprimé avec succé" });
    delepack1(imgId);
    delpackitems(imgId);
    Items.find({ productId: imgId }).then(elt => {
      // console.log(elt);
      elt.forEach(item => {
        // console.log(item);
        //console.log(item._id);
        delitem(item._id);
      });
    });*/
  });

  next();
});
productSchema.post("save", function (doc, next) {
  // console.log("post2", doc);

  /*Items.find({ productId: doc_id }).then(elt => {
    //console.log(elt);
    elt.forEach(item => {
      // console.log(item);
      // console.log(item._id);
      // delitem(item._id);
    }); 
  }); */
  next();
});
//productSchema.plugin(mongoTenant);

//module.exports = mongoose.model("Products", productSchema);
module.exports = productSchema;
