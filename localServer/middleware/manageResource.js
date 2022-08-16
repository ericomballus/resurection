const ResourceItemSchema = require("../api/models/Resource_item");
const productItemsSchema = require("../api/models/ProductItem");
const mongoose = require("mongoose");

function updateStock(id, nbr, req, ResourceItem) {
  let a = mongoose.model("Resourceitem", ResourceItemSchema);

  const tenant2 = a;
  tenant2.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        quantityStore: nbr,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.params.adminId}resourceItem`, success);
      }
    }
  );
}

function updateItemStock(id, nbr, req) {
  let a = mongoose.model("productitems", productItemsSchema);
  /* req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );*/
  const tenant2 = a;
  tenant2.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        quantityStore: nbr,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.params.adminId}productItem`, success);
      }
    }
  );
}

function resourceManager(req, tab, ResourceItem) {
  tab.forEach((elt) => {
    elt["resourceList"].forEach((resour) => {
      // console.log(resour);

      if (resour.product) {
        manageProductItemStcok(req, resour, elt["qty"]);
      } else {
        manageStcok(req, resour, elt["qty"], ResourceItem);
      }
      //la resource plus la quantité
    });
  });
}

function manageStcok(req, resource, qty, ResourceItem) {
  let a = mongoose.model("Resourceitem", ResourceItemSchema);
  /* req.tenancy.getModelByTenant(
    req.dbUse,
    "Resourceitem",
    ResourceItemSchema
  );*/
  const tenant2 = a;
  tenant2
    // .find({}, "-__v")
    .find(
      {
        adminId: req.query.db,
        resourceId: resource.resourceId,
        //quantity: { $gt: 0 },
      },
      "-__v"
    )
    .lean()
    .exec((err, dataR) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }

      //  qty = qty * resource["quantity"];
      let qty1 = 0;
      let elt = dataR[0];
      if (elt["unitName"] == "cl") {
        if (resource.unitName == "cl") {
          qty1 = qty * resource.quantity;
        } else {
        }
      } else if (elt["unitName"] == "g") {
        //pour le kilogramme
        if (resource.unitName == "g") {
          qty1 = qty * resource.quantity;
        } else {
          // qty1 = qty;
        }

        // qty1 = elt["quantityItems"] - qty;
      } else if (elt["unitName"] == "kg") {
        if (resource.unitName == "g") {
          qty1 = (qty * resource.quantity) / 1000;
        } else {
          qty1 = qty * resource.quantity;
        }
      } else if (elt["unitName"] == "l") {
        if (resource.unitName == "cl") {
          qty1 = (qty * resource.quantity) / 100;
        } else {
          qty1 = qty * resource.quantity;
        }
      } else {
        qty1 = qty;
      }

      let i = dataR.length;
      let j = 0;
      let id = dataR[0]["_id"];

      elt["quantityStore"] = Number(elt["quantityStore"]);

      let nbr = elt["quantityStore"] * elt["sizeUnit"] - qty1;
      let newQuantityStore = nbr / elt["sizeUnit"];
      updateStock(id, newQuantityStore, req, ResourceItem);
    });
}

function manageProductItemStcok(req, resource, qty) {
  let a = mongoose.model("productitems", productItemsSchema);
  /*req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );*/
  const tenant2 = a;
  tenant2
    // .find({}, "-__v")
    .find(
      {
        adminId: req.query.db,
        productId: resource.resourceId,
        //quantity: { $gt: 0 },
      },
      "-__v"
    )
    .lean()
    .exec((err, dataR) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }

      let qty1 = 0;
      let elt = dataR[0];
      if (elt["unitNameProduct"] == "cl") {
        if (resource.unitName == "cl") {
          qty1 = (qty * resource.quantity) / elt["sizeUnitProduct"];
        } else {
        }
      } else if (elt["unitNameProduct"] == "l") {
        if (resource.unitName == "cl") {
          qty1 = (qty * resource.quantity) / elt["sizeUnitProduct"];
        }
      }

      let i = dataR.length;
      let j = 0;
      let id = dataR[0]["_id"];

      elt["quantityStore"] = Number(elt["quantityStore"]);
      let newQuantityStore = elt["quantityStore"] - qty1;
      let nbr = newQuantityStore;

      updateItemStock(id, nbr, req);
    });
}

module.exports = resourceManager;
