const productItemsSchema = require("../api/models/ProductItem");
const packItem = require("../api/models/ProductPackItem");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const Maeri = require("../api/models/Maeri_Product");
const mongoose = require("mongoose");

updateAndcancelerManager = (tenant, req, res, oldCommande) => {
  let orders = oldCommande;

  orders.forEach((com) => {
    com.products.forEach(async (elt) => {
      if (elt.item.productType == "manufacturedItems") {
        db = req.dbUse;
        let a = mongoose.model("manufactureditemSchema", Manufactureitem);

        const tenant = a;
        if (elt.item._id) {
          tenant
            .findById({ _id: elt.item._id })
            .exec()
            .then((doc) => {
              //  console.log(doc);
              let totalQty = 0;
              if (doc.quantityStore) {
                totalQty = parseInt(elt.qty) + parseInt(doc.quantityStore);
              } else {
                totalQty = parseInt(elt.qty);
              }

              tenant.findOneAndUpdate(
                { _id: elt.item._id },
                {
                  $set: {
                    quantityStore: totalQty,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    // warehouseTransaction(req, obj);
                    req.io.sockets.emit(
                      `${req.body.adminId}manufacturedItem`,
                      success
                    );
                  }
                }
              );
            });
        }
      }

      if (elt.item.productType == "productItems") {
        let a = mongoose.model("productitems", productItemsSchema);

        const tenant = a;

        // tenant;
        if (elt.item._id) {
          tenant
            .findById({ _id: elt.item._id })
            .exec()
            .then((doc) => {
              let prod_glace = 0;
              let nonglace = 0;
              let quantityStore = 0;
              if (parseInt(elt.item.modeG)) {
                prod_glace = parseInt(doc.glace) + parseInt(elt.item.modeG);
                quantityStore = doc.quantityStore + parseInt(elt.item.modeG);
              } else {
                if (parseInt(doc.glace)) {
                  prod_glace = parseInt(doc.glace);
                }

                quantityStore = doc.quantityStore;
              }

              if (parseInt(elt.item.modeNG)) {
                if (parseInt(doc.nonglace)) {
                  if (quantityStore) {
                    nonglace =
                      parseInt(doc.nonglace) + parseInt(elt.item.modeNG);
                    quantityStore = quantityStore + parseInt(elt.item.modeNG);
                  } else {
                    nonglace =
                      parseInt(doc.nonglace) + parseInt(elt.item.modeNG);
                    quantityStore =
                      doc.quantityStore + parseInt(elt.item.modeNG);
                  }
                } else {
                  if (quantityStore) {
                    nonglace = parseInt(elt.item.modeNG);
                    quantityStore = quantityStore + parseInt(elt.item.modeNG);
                  } else {
                    nonglace = parseInt(elt.item.modeNG);
                    quantityStore =
                      doc.quantityStore + parseInt(elt.item.modeNG);
                  }
                }
              } else {
                /*if (elt.item.modeG && !elt.item.modeNG) {
                    nonglace = parseInt(elt.item.modeNG);
                    quantityStore = doc.quantityStore;
                  } */
              }
              //je remets le produit glacé en store glacé
              tenant.findOneAndUpdate(
                { _id: elt.item._id },
                {
                  $set: {
                    glace: prod_glace,
                    nonglace: parseInt(nonglace),
                    quantityStore: quantityStore,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    // warehouseTransaction(req, obj);
                    req.io.sockets.emit(
                      `${req.body.adminId}productItem`,
                      success
                    );
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                error: err,
              });
            });
        } else {
        }
      }
    });
  });
};

module.exports = updateAndcancelerManager;
