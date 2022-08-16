const productItemsSchema = require("../api/models/ProductItem");
const packItem = require("../api/models/ProductPackItem");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const billardSchema = require("../api/models/Billard");
const productListSchema = require("../api/models/Product-List");
const CompanySetting = require("../api/models/Company_Setting");
const Maeri = require("../api/models/Maeri_Product");
const tenant = require("../getTenant");
let db = "maeri";
const mongoose = require("mongoose");
sendToStore = (req, doc) => {
  console.log(doc);
  if (doc.productType && doc.productType == "billard") {
    confirmBillardItems(req, doc);
  } else if (doc.productType && doc.productType == "shoplist") {
    confirmProductList(req, doc);
  } else {
    confirmProductItems(req, doc);
  }

  return;
};

confirmProductItems = async (req, doc) => {
  let a = mongoose.model("productitems", productItemsSchema);
  /* await req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );*/
  const tenant = a;

  tenant
    .findById({ _id: doc.idprod })
    .exec()
    .then(async (result) => {
      log;
      let quantity = doc.quantityItems;
      let quantityInStore = result.quantityStore + quantity;
      let quantityToConfirm = 0;
      quantityToConfirm = result.quantityToConfirm - quantity;
      if (quantityToConfirm < 0) {
        quantityToConfirm = 0;
      }
      let product = await tenant.findOneAndUpdate(
        { _id: result._id },
        {
          $set: {
            quantityToConfirm: quantityToConfirm,
            quantityStore: quantityInStore,
            // confirmStore: 0,
            // quantityItems: newquantity,
          },
        },
        { new: true }
      );

      req.io.sockets.emit(`${product.adminId}productItemToShop`, product);
      req.io.sockets.emit(`${product.adminId}productItem`, product);
      // }
    })
    .catch((err) => {
      console.log(err);
    });
};

countManufacturedItems = (req, elt) => {};

confirmBillardItems = async (req, doc) => {
  db = req.dbUse;
  let a = mongoose.model("billard", billardSchema);
  //await req.tenancy.getModelByTenant(db, "billard", billardSchema);
  const tenant = a;
  tenant;
  tenant
    .findById({ _id: doc.idprod })
    .exec()
    .then(async (result) => {
      let quantity = doc.quantityItems;
      let quantityInStore = result.quantityStore + quantity;
      let quantityToConfirm = 0;
      quantityToConfirm = result.quantityToConfirm - quantity;
      if (quantityToConfirm < 0) {
        quantityToConfirm = 0;
      }
      let product = await tenant.findOneAndUpdate(
        { _id: result._id },
        {
          $set: {
            quantityToConfirm: quantityToConfirm,
            quantityStore: quantityInStore,
            // confirmStore: 0,
            // quantityItems: newquantity,
          },
        },
        { new: true }
      );

      req.io.sockets.emit(`${req.params.adminId}billardItem`, product);
      req.io.sockets.emit(
        `${req.params.adminId}${product.storeId}billardItem`,
        product
      );
      // }
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

countBillardItemsGamme = async (req, elt, qty) => {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("billard", billardSchema);
    // await req.tenancy.getModelByTenant(db, "billard", billardSchema);
    const tenant = a;
    tenant
      .findById({ _id: elt["_id"] })
      .exec()
      .then((doc) => {
        let newQuantity = 0;
        if (doc && doc.quantityStore) {
          newQuantity = doc.quantityStore - qty * elt["toRemove"];
        }

        if (newQuantity < 0) {
          newQuantity = 0;
        }

        tenant.findOneAndUpdate(
          { _id: elt["_id"] },
          {
            // $push: { tabitem: newpackitems },
            $set: {
              quantityStore: newQuantity,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log("billard items", error.message);
              reject(error);
            } else {
              setTimeout(() => {
                resolve(success);
              }, 1000);
              req.io.sockets.emit(`${req.params.adminId}billardItem`, success);
              req.io.sockets.emit(
                `${req.params.adminId}${success.storeId}billardItem`,
                success
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  // });
};

confirmProductList = async (req, doc) => {
  db = req.dbUse;
  let a = mongoose.model("productlist", productListSchema);
  /* await req.tenancy.getModelByTenant(
    db,
    "productlist",
    productListSchema
  );*/
  const tenant = a;
  tenant
    .findById({ _id: doc.idprod })
    .exec()
    .then(async (result) => {
      let quantity = doc.quantityItems;
      let quantityInStore = result.quantityStore + quantity;
      let quantityToConfirm = 0;
      quantityToConfirm = result.quantityToConfirm - quantity;
      if (quantityToConfirm < 0) {
        quantityToConfirm = 0;
      }
      let product = await tenant.findOneAndUpdate(
        { _id: result._id },
        {
          $set: {
            quantityToConfirm: quantityToConfirm,
            quantityStore: quantityInStore,
            // confirmStore: 0,
            // quantityItems: newquantity,
          },
        },
        { new: true }
      );

      req.io.sockets.emit(`${req.params.adminId}productlist`, product);
      req.io.sockets.emit(`${req.params.adminId}shopList`, product);
      // }
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

module.exports.sendToStore = sendToStore;
