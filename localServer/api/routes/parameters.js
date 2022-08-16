const express = require("express");
const mongoose = require("mongoose");
const Parameter = require("../models/Patient_Parameters");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", checkDatabase.db, async (req, res, next) => {
  const parameter = new Parameter(req.body);
  const doc = await parameter.save();
  req.io.sockets.emit(`${req.params.adminId}parameter`, doc);
  res.status(201).json(doc);
});

router.get("/", checkDatabase.db, (req, res, next) => {
  Parameter.find({}, "-__v")
    .lean()
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json({
        custumers: data,
      });
    });
});

router.get("/:adminId", checkDatabase.db, (req, res, next) => {
  //Category
  Parameter.find(
    {
      adminId: req.params.adminId,
      // $or: [{ removeUser: { $exists: false } }, { removeUser: false }],
    },
    "-__v"
  )
    .lean()
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json({
        custumers: data,
      });
    });
});

router.get("/:adminId/:patientId", checkDatabase.db, async (req, res, next) => {
  //Category
  let docs = await Parameter.find({
    patientId: req.params.patientId,
  }).lean();
  res.status(200).json(docs);
});

router.delete("/:id", async (req, res, next) => {
  let Id = req.params.id;

  const filter = { _id: Id };
  const update = {
    removeParameter: true,
  };
  try {
    let result = await Parameter.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/:id", checkDatabase.db, async (req, res, next) => {
  let Id = req.params.id;
  const filter = { _id: Id };
  const update = req.body;
  try {
    let result = await Parameter.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    req.io.sockets.emit(`${req.query.db}customerUpdate`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
