const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
//const resizer = require("node-image-resizer");
//let UPLOAD_LOGO_PATH = "thumbnails";
//let setup = require("../../utils/imageSetUp");
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "maeri" +
        file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
let upload1 = multer({ storage: storage });*/

let UPLOAD_PATH = "uploads";
if (process.platform === "win32") {
  UPLOAD_PATH = "uploads";
} else if (process.platform === "linux") {
  //found = "/home/ubuntu/elpis/server/uploads/" + images.filename;
  UPLOAD_PATH = "/home/ubuntu/elpis/server/uploads/";
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

router.post(
  "/:adminId",
  upload1.single("uploadedImage"),
  async (req, res, next) => {
    let found = "";
    if (process.platform === "win32") {
      found = path.join(UPLOAD_PATH, req.file.filename);
    } else if (process.platform === "linux") {
      found = "/home/ubuntu/elpis/server/uploads/" + req.file.filename;
    }
    //  await resizer(path.join(UPLOAD_PATH, req.file.filename), setup);
    //  await resizer(found, setup);
    req.tenant
      .create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        adminId: req.params.adminId,
      })
      .then((result) => {
        let url =
          req.protocol +
          "://" +
          req.get("host") +
          "/custumerlogo/" +
          result._id;
        req.io.sockets.emit(`${req.params.adminId}newBackground`, result);
        res
          .status(201)
          .json({ message: "ok ok result", data: result, url: url });
      });
  }
);

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant.findById(imgId, (err, images) => {
    if (!err && images) {
      /* fs.access(
        path.join(UPLOAD_LOGO_PATH, "medium_" + images.filename),
        fs.F_OK,
        (err) => {
          if (err) {
            res.status(400).json({
              error: "image inexistante",
            });
            return;
          }

          res.setHeader("Content-Type", "image/jpeg");
          fs.createReadStream(
            path.join(UPLOAD_LOGO_PATH, "medium_" + images.filename)
          ).pipe(res);
        }
      );*/
      let found = "";
      if (process.platform === "win32") {
        found = path.join(UPLOAD_PATH, images.filename);
      } else if (process.platform === "linux") {
        found = "/home/ubuntu/elpis/server/uploads/" + images.filename;
      }
      fs.access(found, fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          res.status(400).json({
            error: "image inexistante",
          });
          return;
        }
        res.setHeader("Content-Type", "image/jpeg");
        fs.createReadStream(found).pipe(res);
      });
    } else {
      res.status(400).json({
        error: "document inexistant",
      });
    }
  });
});

router.get("/adminId/background/:numid", (req, res, next) => {
  req.tenant
    .find({ adminId: req.params.numid }, "-__v")
    .lean()
    .exec((err, products) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      if (Array.isArray(products)) {
        for (let i = 0; i < products.length; i++) {
          var img = products[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/custumerlogo/" +
            img._id +
            "?db=" +
            req.query.db;
        }
        // lecache = { products: images };
        // cache.set;
        res.json({
          products: products.reverse(),
        });
      } else {
        console.log("error");
      }
    });
});

module.exports = router;
