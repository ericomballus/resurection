const productItemsSchema = require("../api/models/ProductItem");
const productListSchema = require("../api/models/Product-List");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const billardSchema = require("../api/models/Billard");
const mongoose = require("mongoose");

cancelerManager = (tenant, req, res, invoice) => {
  let products = [];
  let magasin = false;
  if (req.body.toRemove && req.body.toRemove.length) {
    products = req.body.toRemove;
    magasin = true;
  } else {
    products = req.body.products;
  }
  // console.log(req.body);
  console.log(invoice);
  if (invoice.ristourneProd && invoice.ristourneProd.length) {
    let tab = invoice.ristourneProd;
    let a = mongoose.model("productitems", productItemsSchema);
    /* req.tenancy.getModelByTenant(
      req.dbUse,
      "productitems",
      productItemsSchema
    );*/
    const tenant = a;
    tab.forEach((elt) => {
      tenant
        .findById({ _id: elt.item._id })
        .exec()
        .then((doc) => {
          let stockNoRistourne = doc.stockNoRistourne;
          stockNoRistourne = stockNoRistourne + elt.qty;
          tenant.findOneAndUpdate(
            { _id: elt.item._id },
            {
              $set: {
                stockNoRistourne: stockNoRistourne,
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
    });
  }
  products.forEach(async (elt) => {
    if (elt.item.productType == "manufacturedItems") {
      db = req.dbUse;
      let a = mongoose.model("manufactureditemSchema", Manufactureitem);
      /* await req.tenancy.getModelByTenant(
        db,
        "manufactureditemSchema",
        Manufactureitem
      );*/
      const tenant = a;
      if (elt.item._id) {
        tenant
          .findById({ _id: elt.item._id })
          .exec()
          .then((doc) => {
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

    if (elt.item.productType == "shoplist") {
      db = req.dbUse;
      let a = mongoose.model("productlist", productListSchema);
      /*await req.tenancy.getModelByTenant(
        db,
        "productlist",
        productListSchema
      );*/
      const tenant = a;
      if (elt.item._id) {
        let doc = await tenant.findById({ _id: elt.item._id }).exec();
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
              req.io.sockets.emit(`${req.body.adminId}productlist`, success);
            }
          }
        );
      }
    }

    if (elt.item.productType == "billard") {
      db = req.dbUse;
      let a = mongoose.model("billard", billardSchema);
      //await req.tenancy.getModelByTenant(db, "billard", billardSchema);
      const tenant = a;
      let query = {};
      if (elt.item._id) {
        let doc = await tenant.findById({ _id: elt.item._id }).exec();
        let totalQty = 0;

        if (magasin || req.body.sc) {
          if (doc.quantityItems) {
            totalQty = parseInt(elt.qty) + parseInt(doc.quantityItems);
          } else {
            totalQty = parseInt(elt.qty);
          }
          query = { quantityItems: totalQty };
        } else {
          if (doc.quantityStore) {
            totalQty = parseInt(elt.qty) + parseInt(doc.quantityStore);
          } else {
            totalQty = parseInt(elt.qty);
          }
          query = { quantityStore: totalQty };
        }

        tenant.findOneAndUpdate(
          { _id: elt.item._id },
          {
            $set: query,
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.body.adminId}billardItem`, success);
              req.io.sockets.emit(
                `${doc.adminId}${doc.storeId}billardItem`,
                success
              );
            }
          }
        );
      }
    }

    if (elt.item.productType == "Gamme") {
      elt["item"]["productList"].forEach((prod) => {
        returnBillardItemsGamme(req, prod, parseInt(elt["qty"]), invoice);
      });
    }

    if (elt.item.productType == "productItems") {
      let a = mongoose.model("productitems", productItemsSchema);
      /* await req.tenancy.getModelByTenant(
        req.dbUse,
        "productitems",
        productItemsSchema
      );*/
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
            if (!parseInt(elt.item.modeG) && !parseInt(elt.item.modeNG)) {
              quantityStore = doc.quantityStore + parseInt(elt.item.qty);
              // return
            } else {
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
                  console.log("mise a jour ===>", success);
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
};
returnBillardItemsGamme = async (req, elt, nbr, invoice) => {
  db = req.dbUse;
  let a = mongoose.model("billard", billardSchema);
  //await req.tenancy.getModelByTenant(db, "billard", billardSchema);
  const tenant = a;
  let query = {};
  if (elt._id) {
    let doc = await tenant.findById({ _id: elt._id }).exec();
    let totalQty = 0;
    if (invoice.sale) {
      if (doc.quantityItems) {
        totalQty = nbr * elt["toRemove"] + parseInt(doc.quantityItems);
      } else {
        totalQty = parseInt(nbr * elt["toRemove"]);
      }
      query = { quantityItems: totalQty };
    } else {
      if (doc.quantityStore) {
        totalQty = nbr * elt["toRemove"] + parseInt(doc.quantityStore);
      } else {
        totalQty = parseInt(nbr * elt["toRemove"]);
      }
      query = { quantityStore: totalQty };
    }
    console.log(
      ` invoic status ${invoice.sale} gamme remove query here ${elt.name}===>${query}`
    );
    tenant.findOneAndUpdate(
      { _id: elt._id },
      {
        $set: query,
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          if (invoice.sale) {
            // facture déja encaissé
            req.io.sockets.emit(
              `${req.query.db}${elt.storeId}billardItemRestore`,
              success
            );
          } else {
            //facture pas encore encaissé
            req.io.sockets.emit(
              `${req.query.db}${elt.storeId}billardItem`,
              success
            );
          }
        }
      }
    );
  }
};

module.exports = cancelerManager;
