const express = require("express");
const mongoose = require("mongoose");
const Hospitalisation = require("../models/Hospitalisation");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", checkDatabase.db, async (req, res, next) => {
  const hospi = new Hospitalisation(req.body);
  const doc = await hospi.save();
  req.io.sockets.emit(`${req.params.adminId}hospitalisation`, doc);
  res.status(201).json(doc);
});

router.get("/", checkDatabase.db, (req, res, next) => {
  Hospitalisation.find({}, "-__v")
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
    let docs = await Hospitalisation.find({ adminId: req.params.adminId })
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
    let docs = await Hospitalisation.find({ patientId: req.params.patientId })
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

router.get(
  "/:adminId/find/byDate",
  checkDatabase.db,
  async (req, res, next) => {
    //Category
    try {
      let docs = await Hospitalisation.find({
        adminId: req.query.db,
        created: {
          $gte: req.query.start,
          $lte: req.query.end,
        },
      })
        .populate("authorId patientId senderId")
        .sort({ _id: -1 })
        .exec();
      res.status(200).json(docs);
    } catch (e) {
      console.error(e);
    } finally {
      console.log("We do cleanup here");
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  let Id = req.params.id;

  const filter = { _id: Id };
  const update = {
    removeParameter: true,
  };
  try {
    let result = await Hospitalisation.findOneAndUpdate(
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
  update["endAt"] = new Date().getTime();
  update["actif"] = false;
  try {
    let result = await Hospitalisation.findOneAndUpdate(
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
//675719497
