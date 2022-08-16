const mongoose = require("mongoose");
const productItemSchema = require("../api/models/ProductItem");
const packItemSchema = require("../api/models/ProductPackItem");
const PackSchema = require("../api/models/ProductPack");
const ResourceItem = require("../api/models/Resource_item");
const tenant = require("../getTenant");
let db = "maeri";
const createProductItem = async (req, obj, id) => {
  console.log("helloolllll====================");
  console.log(obj);

  db = req.dbUse;
  let a = await req.tenancy.getModelByTenant(
    "maeri",
    "productitems",
    productItemSchema
  );
  const tenant = a;
  return new Promise((resolve, reject) => {
    // console.log("je 'envoi", data["data"]);
    if (obj["sizeUnit"]) {
      obj["sizeUnitProduct"] = obj["sizeUnit"];
    }
    if (obj["unitName"]) {
      obj["unitNameProduct"] = obj["unitName"];
    }
    tenant
      .create({
        productId: id,
        name: obj.name,
        capacity: obj.capacity,
        purchasingPrice: obj.purchasingPrice,
        sellingPrice: obj.sellingPrice,
        adminId: obj.adminId,
        maeriId: obj.maeriId,
        unitNameProduct: obj.unitName,
        sizeUnitProduct: obj.sizeUnit,
        produceBy: obj.produceBy,
        url: obj.url,
        packSize: obj.packSize,
        packPrice: obj.packPrice,
        categoryName: req.body.categoryName,
        superCategory: req.body.superCategory,
      })
      // .save(req.body)
      .then((resultat) => {
        // console.log(resultat);
        // console.log("======================================items");
        resolve(resultat);
        createPack(req, resultat);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const createPack = async (req, data) => {
  let a = await req.tenancy.getModelByTenant(req.dbUse, "pack", PackSchema);
  const tenant = a;

  tenant
    .create({
      productItemId: data._id,
      productId: data.productId,
      produceBy: data.produceBy,
      url: data.url,
      adminId: data.adminId,
      maeriId: data.maeriId,
      name: data.name,
      sizePack: parseInt(req.body.packSize),
      unitNameProduct: data.unitName,
      unitNamePack: data.unitName,
      sizeUnitProduct: data.sizeUnit,
      purchasingPrice: req.body.packPrice,
      categoryName: req.body.categoryName,
      superCategory: req.body.superCategory,
    })
    .then((resu) => {
      createPackItems(req, resu);
      console.log(resu);
      req.io.sockets.emit(`${req.body.adminId}newPack`, resu);
    })

    .catch((err) => {
      console.log(err);
    });
};

const createPackItems = async (req, data) => {
  let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "packitems",
    packItemSchema
  );
  const tenant = a;

  tenant
    .create({
      productId: data.productId,
      productPackId: data._id,
      adminId: data.adminId,
      purchasingPrice: req.body.purchasingPrice,
      sellingPrice: req.body.sellingPrice,
      name: data.name,
      url: data.url,
      itemsInPack: data.sizePack,
      unitNameProduct: req.body.unitName,
      sizeUnitProduct: req.body.sizeUnit,
      maeriId: req.body.maeriId,
      categoryName: req.body.categoryName,
      superCategory: req.body.superCategory,
    })
    .then((data) => {
      console.log(data);
      req.io.sockets.emit(`${req.body.adminId}newPackItem`, data);
    });
};

const moveUpdate = async (req) => {
  req
    .model("Packitems")
    .find({ adminId: req.params.adminId })
    // .select("product quantity _id")
    .populate("packId")
    .exec()
    .then((docs) => {
      // docs.filter((elt) => elt.)
      console.log("+++++++");
      console.log(docs);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  createProductItem: createProductItem,
  moveUpdate: moveUpdate,
};
