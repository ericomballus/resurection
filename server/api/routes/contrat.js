const express = require("express");
const fs = require("fs");

const Contrat = require("../models/Contrat_model");

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const contrat = new Contrat(req.body);
    let doc = await contrat.save();
    req.io.sockets.emit(`contrat`, doc);
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:adminId", async (req, res, next) => {
  try {
    let docs = await Contrat.find({ adminId: req.params.adminId })
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(docs);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };

  Contrat.findOneAndUpdate(
    filter,
    { $set: req.body },
    {
      new: true,
    }
  )
    .then((doc) => {
      req.io.sockets.emit(`update_contrat`, doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Contrat.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "role Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
