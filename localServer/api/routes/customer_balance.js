const express = require("express");
const mongoose = require("mongoose");
const Balance = require("../models/Customer_Balance");
const checkDatabase = require("../../middleware/check_database");
const Custumer = require("../models/Custumer");
const router = express.Router();
let io = require("socket.io");

router.post("/", checkDatabase.db, async (req, res, next) => {
  const balance = new Balance(req.body);
  balance.save().then(async (data) => {
    console.log("custumer created", data);
    let Id = data["customerId"];
    const filter = { _id: Id };
    const update = { solde: data["amount"] };
    try {
      let result = await Custumer.findOneAndUpdate(
        filter,
        { $set: update },
        { new: true }
      );
      req.io.sockets.emit(`${req.query.db}customerUpdate`, result);
      req.io.sockets.emit(`${req.params.adminId}customerBalance`, data);
      res.status(201).json({ message: "balance", data: data });
    } catch (e) {
      console.error(e);
      res.status(500).json(e);
    }
  });
});

router.get("/", checkDatabase.db, (req, res, next) => {
  //Category
  Balance.find({}, "-__v")
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

router.get("/:customerId", async (req, res, next) => {
  try {
    let docs = await Balance.find({ customerId: req.params.customerId })
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(docs);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:customerId/type", checkDatabase.db, (req, res, next) => {
  //Category

  Balance.find(
    {
      customerId: req.params.customerId,
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
    let result = await Balance.findOneAndUpdate(
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
    let result = await Balance.findOneAndUpdate(
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
