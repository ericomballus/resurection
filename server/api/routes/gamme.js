const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const Gamme = require("../models/Gamme");
const test = require("../../middleware/multytenant");
const checkDatabase = require("../../middleware/check_database");
const router = express.Router();
let io = require("socket.io");
let UPLOAD_PATH = "uploads";
if (process.platform === "win32") {
  UPLOAD_PATH = "uploads";
} else if (process.platform === "linux") {
  //found = "/home/ubuntu/elpis/server/uploads/" + images.filename;
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

router.post("/", upload1.single("image"), (req, res, next) => {
  req.tenant
    .create({
      _id: new mongoose.Types.ObjectId(),
      adminId: req.query.db,
      name: req.body.name,
      sellingPrice: req.body.sellingPrice,
      productList: JSON.parse(req.body.productList),
      filename: req.file.filename,
      originalname: req.file.originalname,
      storeId: req.body.storeId,
    })
    .then((data) => {
      let url =
        req.protocol +
        "://" +
        req.get("host") +
        "/gamme/" +
        data._id +
        "?db=" +
        req.params.adminId;

      let result = {
        _id: data._id,
        adminId: data.adminId,
        name: req.body.name,
        sellingPrice: data.sellingPrice,
        productList: data.productList,
        filename: data.filename,
        originalname: data.originalname,
        storeId: data.storeId,
      };
      result["url"] = url;
      req.io.sockets.emit(`${req.query.db}newGamme`, result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:transfert", async (req, res, next) => {
  console.log(req.body);
  let result = await req.tenant.find({
    storeId: req.body.storeId,
    filename: req.body.filename,
  });
  if (result && result.length) {
    res.status(201).json("cettte gamme existe deja");
  } else {
    req.tenant
      .create(req.body)
      .then((data) => {
        let url =
          req.protocol +
          "://" +
          req.get("host") +
          "/gamme/" +
          data._id +
          "?db=" +
          req.params.adminId;

        let result = {
          _id: data._id,
          adminId: data.adminId,
          name: req.body.name,
          sellingPrice: data.sellingPrice,
          productList: data.productList,
          filename: data.filename,
          originalname: data.originalname,
          storeId: data.storeId,
        };
        result["url"] = url;
        req.io.sockets.emit(`${req.query.db}newGamme`, result);
        res.status(201).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
router.get(
  "/",

  (req, res, next) => {
    req.tenant
      .find({
        adminId: req.query.db,
        desabled: false,
      })
      .lean()
      .exec((err, docs) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        for (let i = 0; i < docs.length; i++) {
          // var img = products[i];
          var img = docs[i];
          if (!img.newUrl && img.filename) {
            img.url =
              req.protocol +
              "://" +
              req.get("host") +
              "/gamme/" +
              img._id +
              "?db=" +
              req.query.db;
          } else if (img.newUrl) {
            img.url = img.newUrl;
          }
        }

        res.json(docs);
      });
  }
);

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant.findById(imgId, (err, images) => {
    if (!err && images) {
      // fs.access(path.join(UPLOAD_PATH, images.filename), fs.F_OK, (error) => {
      let found = "";
      if (process.platform === "win32") {
        found = path.join(UPLOAD_PATH, images.filename);
      } else if (process.platform === "linux") {
        found = require("../../config").IMAGE_URL_PATH + images.filename;
      }
      fs.access(found, fs.F_OK, (error) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            message: "image inexistante",
            error: error,
          });
          return;
        }

        res.setHeader("Content-Type", "image/jpeg");
        /* fs.createReadStream(path.join(UPLOAD_PATH, images.filename)).pipe(
            res
          );*/
        fs.createReadStream(found).pipe(res);
      });
    } else {
      res.status(500).json({
        message: `le document est inexistante`,
        error: err,
      });
    }
  });
});

router.get(
  "/:id/:shop",

  (req, res, next) => {
    req.tenant
      .find({
        adminId: req.query.db,
        desabled: false,
        storeId: req.query.storeId,
      })
      .lean()
      .exec((err, docs) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        for (let i = 0; i < docs.length; i++) {
          // var img = products[i];
          var img = docs[i];
          if (!img.newUrl && img.filename) {
            img.url =
              req.protocol +
              "://" +
              req.get("host") +
              "/gamme/" +
              img._id +
              "?db=" +
              req.query.db;
          } else if (img.newUrl) {
            img.url = img.newUrl;
          }
        }

        res.json(docs);
      });
  }
);

router.patch("/", async (req, res, next) => {
  let Id = req.body._id;
  const filter = { _id: Id };
  const update = req.body;
  try {
    let result = await req.tenant.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    let url = "";
    let newUrl = "";
    if (result.newUrl) {
      url = result.newUrl;
      newUr = result.newUrl;
    } else {
      url =
        req.protocol +
        "://" +
        req.get("host") +
        "/gamme/" +
        result._id +
        "?db=" +
        req.query.db;
    }
    let doc = {
      _id: result._id,
      adminId: result.adminId,
      name: req.body.name,
      sellingPrice: result.sellingPrice,
      productList: result.productList,
      filename: result.filename,
      originalname: result.originalname,
      newUrl: newUrl,
      productType: result.productType,
      desabled: result.desabled,
      url: url,
      created: result.created,
      storeId: result.storeId,
    };
    req.io.sockets.emit(`${req.query.db}gammeUpdate`, doc);
    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
  }
});

router.delete("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant
    .remove({ _id: imgId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "gamme delete",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;

//remove({ _id: req.params.id })
