const express = require("express");
const Category = require("../models/Category");

const sublease = require("mongoose-sublease");
const mongoose = require("mongoose");
const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", (req, res, next) => {
  console.log(req.body);
  req.tenant
    .create({
      name: req.body.name,
      adminId: req.params.adminId,
      page: req.body.page,
    })
    .then((data) => {
      res.status(201).json({ message: "ok ok product", data: data });
    });
});

router.get("/cat/:adminId", (req, res, next) => {
  //req.tenant
  req.tenant
    .find({ adminId: req.params.adminId }, "-__v")
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

router.delete(
  "/:id/:adminId",

  (req, res, next) => {
    let catId = req.params.id;
    // let adminId = req.params.adminId;
    // console.log(adminId);
    req.tenant
      .remove({ _id: catId })
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
  }
);

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  req.tenant
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
