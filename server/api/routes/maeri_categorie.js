const express = require("express");
const mongoose = require("mongoose");
const categoryMaeri = require("../models/Maeri_Category");
const removeProduct = require("../../middleware/cleaner");
const router = express.Router();
let io = require("socket.io");

router.post("/", (req, res, next) => {
  const cat = new categoryMaeri({
    name: req.body.name,
  });

  //console.log("ici tenant1", tenant1);
  cat.save().then((data) => {
    // return req.model("Product").find();//ce connecte a helpis
    res.json({
      category: data,
    });
  });
});

router.get("/", (req, res, next) => {
  //Category
  categoryMaeri
    .find({}, "-__v")
    .lean()
    .exec((err, cat) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json({
        category: cat,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  let catId = req.params.id;

  categoryMaeri
    .remove({ _id: catId })
    .exec()
    .then((result) => {
      removeProduct(catId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(200).json({
        message: "category Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  categoryMaeri
    .update({ _id: id }, { $set: updateOps })
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

module.exports = router;
