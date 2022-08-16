const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");

const TaxiPub = require("../models/Taxi_Image_Pub");

const router = express.Router();
let io = require("socket.io");

let UPLOAD_PATH = "uploads";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post("/", upload1.single("image"), async (req, res, next) => {
  //console.log("ici tenant1", tenant1);

  const taxiPub = new TaxiPub({
    filename: req.file.filename,
    originalName: req.file.originalname,
    name: req.body.name,
  });
  taxiPub.save().then(async (prod) => {
    var result = { ...prod };
    var result2 = { ...result._doc };
    result2["url"] =
      req.protocol + "://" + req.get("host") + "/taxipub/" + prod._id;
    // let url = req.protocol + "://" + req.get("host") + "/taxipub/" + prod._id;

    req.io.sockets.emit(`taxi_image_pub`, result2);
    res.status(201).json(result2);
  });
});

router.get("/", (req, res, next) => {
  // Maeri.find({}, "-__v")
  // .lean()
  //  Maeri.find({}, "-__v")
  console.log("hello pub");
  TaxiPub.find({}, "-__v")
    //.lean()
    .exec((err, products) => {
      let tab = [];
      console.log(products);
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      if (products) {
        // console.log(products);

        products.forEach((prod) => {
          var result = { ...prod };
          var result2 = { ...result._doc };
          result2["url"] =
            req.protocol + "://" + req.get("host") + "/taxipub/" + prod._id;
          tab.push(result2);
        });

        res.status(200).json(tab);
      } else {
        console.log("error");
      }
    });
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  TaxiPub.findById(imgId, (err, images) => {
    //console.log(images);
    if (!err && images) {
      fs.access(path.join(UPLOAD_PATH, images.filename), fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          res.status(400).json({
            error: "image inexistante",
          });
          return;
        }

        res.setHeader("Content-Type", "image/jpeg");
        fs.createReadStream(path.join(UPLOAD_PATH, images.filename)).pipe(res);
      });
    } else {
      //ici j'ecris sur le fichier log
      console.log(err);

      res.status(400).json({
        error: "document inexistant",
      });
    }
  });
});

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  try {
    const filter = { _id: id };
    const update = { $set: req.body };
    let pub = TaxiPub.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(pub);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
  /*  TaxiPub.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({
          message: "mise a jour ",
          resultat: success,
         
        });
      }
    }
  ).catch((err) => {
    res.status(400).json({
      error: err,
    });
    
  });*/
});

router.delete("/:id", async (req, res, next) => {
  let imgId = req.params.id;
  console.log(imgId);
  try {
    let result = await TaxiPub.findByIdAndDelete(req.params.id);
    console.log(result);

    del([path.join(UPLOAD_PATH, result.filename)]).then((deleted) => {
      req.io.sockets.emit(`delete_taxi_image_pub`, result);
      res.status(200).json({ message: "image supprimé avec succé" });
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
  /* TaxiPub.findByIdAndRemove({ _id: imgId }, (err, image) => {
    del([path.join(UPLOAD_PATH, image.filename)]).then((deleted) => {
      res.status(200).json({ message: "image supprimé avec succé" });
    });
  });*/

  /* TaxiPub.findByIdAndDelete(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", docs);
      del([path.join(UPLOAD_PATH, docs.filename)]).then((deleted) => {
        res.status(200).json({ message: "image supprimé avec succé" });
      });
    }
  }); */
});
module.exports = router;
