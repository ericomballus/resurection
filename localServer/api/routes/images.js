const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const router = express.Router();
const ImagesStore = require("../models/ImagesStore");
let io = require("socket.io");
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

router.post("/", upload1.single("image"), (req, res, next) => {
  const Image = new ImagesStore({
    _id: new mongoose.Types.ObjectId(),
    adminId: req.query.db,
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
  Image.save()
    .then((data) => {
      let url =
        req.protocol +
        "://" +
        req.get("host") +
        "/images/" +
        data._id +
        "?db=" +
        req.query.db;

      let result = {
        _id: data._id,
        adminId: data.adminId,
        filename: data.filename,
        originalname: data.originalname,
      };
      result["url"] = url;
      req.io.sockets.emit(`${req.query.db}newImages`, result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  ImagesStore.findById(imgId, (err, images) => {
    //console.log(images);
    if (!err && images) {
      let found = "";
      if (process.platform === "win32") {
        found = path.join(UPLOAD_PATH, images.filename);
      } else if (process.platform === "linux") {
        found = "/home/ubuntu/elpis/server/uploads/" + images.filename;
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

        fs.createReadStream(found).pipe(res);
      });
    } else {
      res.status(400).json({
        error: "document inexistant",
      });
    }
  });
});

module.exports = router;
