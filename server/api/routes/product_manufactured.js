const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const tenant = require("../../getTenant");
const Product_manufactured = require("../models/Product-manufactured");
const Manufactureitem = require("../models/Product-manufactured-item");
const test = require("../../middleware/multytenant");
const { ObjectId } = require("mongodb");
const createManufacturedItem = require("../../utils/createManufactured");
const router = express.Router();
let io = require("socket.io");

let UPLOAD_PATH = "uploads";
if (process.platform === "win32") {
  UPLOAD_PATH = "uploads";
} else if (process.platform === "linux") {
  UPLOAD_PATH = require("../../config").IMAGE_URL_PATH;
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post("/:adminId", upload1.single("image"), (req, res, next) => {
  req.tenant
    .create({
      _id: new mongoose.Types.ObjectId(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      adminId: req.params.adminId,
      name: req.body.name,
      sellingPrice: req.body.sellingPrice,
      description: req.body.description,
      categoryId: req.body.categoryId,
      resourceList: JSON.parse(req.body.resourceList),
      categoryName: req.body.categoryName,
      produceBy: req.body.produceBy,
      maeriId: req.body.maeriId,
      url: req.body.url,
      source: req.body.source,
      superCategory: req.body.superCategory,
      storeId: req.body.storeId,
      size: req.body.size,
      purchasingPrice: parseFloat(req.body.purchasingPrice),
    })
    .then(async (data) => {
      let result = data;
      result._id = data._id;
      data["productId"] = data._id;
      data["test"] = "maeri";
      data["url"] =
        req.protocol +
        "://" +
        req.get("host") +
        "/" +
        `products_resto/${data._id}?db=${req.params.adminId}`;
      let endOperation = await createManufacturedItem(req, res, data);
      req.io.sockets.emit(`${req.params.adminId}manufactured`, data);
      res.status(201).json({ message: "ok ok product", data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/imagemaeri/:adminId", (req, res, next) => {
  req.tenant
    .create({
      _id: new mongoose.Types.ObjectId(),
      filename: req.body.filename,
      originalName: req.body.originalname,
      adminId: req.params.adminId,
      name: req.body.name,
      sellingPrice: req.body.sellingPrice,
      description: req.body.description,
      categoryId: req.body.categoryId,
      resourceList: req.body.resourceList,
      url: req.body.url,
      maeriId: req.body.maeriId,
      source: req.body.source,
      superCategory: req.body.superCategory,
      storeId: req.body.storeId,
      size: req.body.size,
    })
    .then((data) => {
      let result = data;
      result._id = data._id;
      req.io.sockets.emit(`${req.params.adminId}manufactured`, data);
      res.status(201).json({ message: "ok ok product", data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

//takke all products
router.get(
  "/adminId/:numid",

  (req, res, next) => {
    req.tenant
      .find({ adminId: req.params.numid }, "-__v")
      .lean()
      .exec((err, images) => {
        console.log(images);
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        for (let i = 0; i < images.length; i++) {
          // var img = images[i];
          var img = images[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/products_resto/" +
            img._id +
            "?db=" +
            req.query.db;
        }
        // lecache = { products: images };
        // cache.set;
        res.json({
          products: images.reverse(),
        });
      });
  }
);

router.get(
  "/adminId/:name/:numid",

  (req, res, next) => {
    req.tenant
      .find({ name: { $regex: req.params.name } })
      .lean()
      .exec((err, images) => {
        console.log(images);
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        for (let i = 0; i < images.length; i++) {
          // var img = images[i];
          var img = images[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/products/" +
            img._id +
            "?db=" +
            req.query.db;
        }
        // lecache = { products: images };
        // cache.set;
        res.json({
          product: images,
        });
      });
  }
);

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant.findById(imgId, (err, doc) => {
    if (err) {
      res.sendStatus(400);
    }

    if (doc) {
      let found = "";
      if (process.platform === "win32") {
        found = path.join(UPLOAD_PATH, doc.filename);
      } else if (process.platform === "linux") {
        // found = "/home/ubuntu/elpis/server/uploads/" + doc.filename;
        found = require("../../config").IMAGE_URL_PATH + doc.filename;
      }
      res.setHeader("Content-Type", "image/jpeg");
      // fs.createReadStream(path.join(UPLOAD_PATH, structure.filename)).pipe(res);
      fs.createReadStream(found).pipe(res);
    }
  });
});
router.delete("/:id", (req, res, next) => {
  let imgId = req.params.id;

  // Product
  req.tenant.findOneAndUpdate(
    { _id: imgId },
    {
      $set: {
        disable: true,
        desabled: true,
      },
    },
    { new: true },
    async (error, success) => {
      if (error) {
        console.log(error);
      } else {
        db = req.dbUse;
        let a = await req.tenancy.getModelByTenant(
          db,
          "manufactureditemSchema",
          Manufactureitem
        );
        const tenant = a;
        tenant.findOneAndUpdate(
          { productId: ObjectId(imgId) },
          {
            $set: {
              disablemanufactured: false,
              desabled: true,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              res.status(200).json({ message: "image supprimé avec succé" });
            }
          }
        );
      }
    }
  );
});
// for update product
router.post("/product/update/admin/db", (req, res, next) => {
  const id = req.body._id;
  console.log(req.body);
  console.log(id);

  req.tenant
    .findOneAndUpdate({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "produit mise a jour",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

router.patch("/:id", async (req, res, next) => {
  let prodId = req.params.id;
  console.log();
  req.tenant
    .findOneAndUpdate({ _id: prodId }, { $set: req.body }, { new: true })
    .exec()
    .then(async (result) => {
      let db = req.dbUse;
      let a = await req.tenancy.getModelByTenant(
        db,
        "manufactureditemSchema",
        Manufactureitem
      );
      let obj = req.body;

      delete obj["_id"];
      const tenant2 = a;
      tenant2
        .findOneAndUpdate({ productId: prodId }, { $set: obj }, { new: true })
        .exec()
        .then((item) => {
          res.status(200).json({
            message: "produit mise a jour",
            result: result,
            item: item,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

module.exports = router;
