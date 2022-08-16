const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
let io = require("socket.io");

router.post("/", (req, res, next) => {
  console.log(req.body);
  req.tenant.create(req.body).then((data) => {
    res.status(201).json(data);
  });
});

router.get("/", (req, res, next) => {
  //req.tenant
  req.tenant
    .find({ adminId: req.query.db }, "-__v")
    .lean()
    .exec((err, docs) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json(docs);
    });
});
router.get("/:byDate", (req, res, next) => {
  req.tenant
    .find({
      $or: [{ adminId: req.query.db }, { adminId: new ObjectId(req.query.db) }],
      created: {
        $gte: req.query.start,
        $lte: req.query.end,
      },
    })
    .then(function (docs) {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/:id", (req, res, next) => {
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
});

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
