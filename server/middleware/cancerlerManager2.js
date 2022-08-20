const productItemsSchema = require("../api/models/ProductItem");
const packItem = require("../api/models/ProductPackItem");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const mongoose = require("mongoose");
cancelerManager2 = (req, docs) => {
  return new Promise((resolve, reject) => {
    let products = docs;
    products.forEach(async (elt) => {
      if (elt.item.productType == "manufacturedItems") {
        db = req.dbUse;
        let a = mongoose.model("manufactureditemSchema", Manufactureitem);
        /*  await req.tenancy.getModelByTenant(
          db,
          "manufactureditemSchema",
          Manufactureitem
        );*/
        const tenant = a;
      }

      if (elt.item.productType == "productItems") {
        let a = mongoose.model("productitems", productItemsSchema);
        /* await req.tenancy.getModelByTenant(
          req.dbUse,
          "productitems",
          productItemsSchema
        );*/
        const tenant = a;
        if (elt.item._id) {
          tenant
            .findById({ _id: elt.item._id })
            .exec()
            .then((doc) => {
              // console.log(doc);
              let obj = {
                name: doc.name,
                quantityItems: doc.quantity,
                idprod: doc._id,
              };
              let prod_glace;
              if (doc.glace) {
                prod_glace = parseInt(doc.glace);
              } else {
                prod_glace = 0;
              }

              //let qtyGlace = parseInt(req.body.quantity);
              // let quantityInStore = parseInt(doc.quantityStore);
              let nonglace = parseInt(doc.quantityStore);
              //je remets le produit glacé en store glacé
              if (elt.item.modeG) {
                prod_glace = parseInt(elt.item.modeG) + doc.glace;
              }
              if (elt.item.modeNG) {
                nonglace = nonglace + parseInt(elt.item.modeNG);
              }

              tenant.findOneAndUpdate(
                { _id: elt.item._id },
                {
                  $set: {
                    glace: prod_glace,
                    nonglace: parseInt(nonglace),
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
        }
      }
    });
    resolve("ok");
  });
};

module.exports = cancelerManager2;
