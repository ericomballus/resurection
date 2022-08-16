const express = require("express");
const mongoose = require("mongoose");
const Custumer = require("../models/Custumer");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", checkDatabase.db, (req, res, next) => {
  const custumer = new Custumer(req.body);
  custumer.save().then((data) => {
    req.io.sockets.emit(`${req.params.adminId}customerAdd`, data);
    res.status(201).json({ message: "custumer", data: data });
  });
});

router.get("/", checkDatabase.db, (req, res, next) => {
  //Category
  Custumer.find({}, "-__v")
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
  Custumer.find(
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

router.get("/:adminId/customer", checkDatabase.db, (req, res, next) => {
  //Category
  Custumer.find(
    {
      adminId: req.params.adminId,
      _id: req.query.customerId,
    },
    "-__v"
  )
    .lean()
    .exec((err, docs) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json(docs[0]);
    });
});

router.delete("/:id", async (req, res, next) => {
  let Id = req.params.id;

  const filter = { _id: Id };
  const update = {
    removeUser: true,
  };
  try {
    let result = await Custumer.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    req.io.sockets.emit(`${req.query.db}customerDelete`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/:id", checkDatabase.db, async (req, res, next) => {
  let Id = req.params.id;
  console.log(req.body);
  const filter = { _id: Id };
  const update = req.body;
  try {
    let result = await Custumer.findOneAndUpdate(
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
