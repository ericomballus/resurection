const express = require("express");
const mongoose = require("mongoose");
const Madeby = require("../models/Maeri_Madeby");

const router = express.Router();
let io = require("socket.io");

router.post("/", (req, res, next) => {
  const made = new Madeby({
    name: req.body.name,
  });

  //console.log("ici tenant1", tenant1);
  made
    .save()
    .then((data) => {
      // return req.model("Product").find();//ce connecte a helpis
      // return Madeby.find({}); //ce connecte a helpise
    })
    .then((data) => {
      res.status(201).json({ message: "ok ok product", data: data });
    });
});

router.get("/", (req, res, next) => {
  //Category
  Madeby.find({}, "-__v")
    .lean()
    .exec((err, mades) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json({
        madeby: mades,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  let madeId = req.params.id;

  Madeby.remove({ _id: madeId })
    .exec()
    .then((result) => {
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

  Madeby.update({ _id: id }, { $set: updateOps })
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
