const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Parametre = require("../models/Patient_Parameters");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/", checkDatabase.db, async (req, res, next) => {
  try {
    let user = await Patient.find({
      adminId: req.body.adminId,
      phone: req.body.phone,
      name: req.body.name,
    }).exec();

    if (user && user.phone) {
      req.body["patientId"] = user._id;
      const parametre = await new Parametre(req.body).save();
      req.io.sockets.emit(`${req.body.adminId}patient`, user);
      res.status(201).json(user);
    } else {
      const patient = new Patient(req.body);
      const doc = await patient.save();
      req.body["patientId"] = doc._id;
      const parametre = await new Parametre(req.body).save();
      //let result = { ...doc, ...parametre };
      req.io.sockets.emit(`${req.body.adminId}patient`, doc);
      res.status(201).json(doc);
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/", checkDatabase.db, (req, res, next) => {
  Patient.find({}, "-__v")
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
  if (req.query.today) {
    let today = new Date();
    let d = new Date().toISOString().substring(0, 10);
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.toISOString;
    let t = tomorrow.toISOString().substring(0, 10);
    try {
      let list = await Patient.find({
        adminId: req.params.adminId,
        created: { $gte: new Date(d), $lt: new Date(t) },
      }).exec();
      res.json(list);
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  } else {
    try {
      let list = await Patient.find({
        adminId: req.params.adminId,
      })
        .sort({ name: 1 })
        .exec();
      res.json(list);
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
});

router.get("/:adminId/customer", checkDatabase.db, (req, res, next) => {
  //Category
  Patient.find(
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
    let result = await Patient.findOneAndUpdate(
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
  const filter = { _id: Id };
  const update = req.body;
  try {
    let result = await Patient.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    req.io.sockets.emit(`${req.query.db}patientUpdate`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
