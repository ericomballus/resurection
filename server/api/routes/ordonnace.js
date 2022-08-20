const express = require("express");
const mongoose = require("mongoose");
const Ordonnance = require("../models/Ordonnance");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", checkDatabase.db, async (req, res, next) => {
  const ordonnance = new Ordonnance(req.body);
  const doc = await ordonnance.save();
  req.io.sockets.emit(`${req.params.adminId}ordonnance`, doc);
  res.status(201).json(doc);
});

router.get("/", checkDatabase.db, (req, res, next) => {
  Ordonnance.find({}, "-__v")
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

router.get("/:adminId", checkDatabase.db, async (req, res, next) => {
  //Category

  try {
    let docs = await Ordonnance.find({ adminId: req.params.adminId })
      .populate("authorId")
      .sort({ _id: -1 })
      .limit(50)
      .exec();
    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/:adminId/:patientId", checkDatabase.db, async (req, res, next) => {
  //Category
  try {
    let docs = await Ordonnance.find({ patientId: req.params.patientId })
      .populate("authorId patientId senderId")
      .sort({ _id: -1 })
      .exec();
    res.status(200).json(docs);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.delete("/:id", async (req, res, next) => {
  let Id = req.params.id;

  const filter = { _id: Id };
  const update = {
    removeParameter: true,
  };
  try {
    let result = await Ordonnance.findOneAndUpdate(
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
    let result = await Ordonnance.findOneAndUpdate(
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
