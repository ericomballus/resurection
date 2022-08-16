const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cashOpen = require("../models/TaxiCashOpening");

router.get("/:adminId", async (req, res, next) => {
  try {
    console.log(req.params.adminId);
    const cash = await cashOpen
      .find({ adminId: req.params.adminId, open: true })
      .sort({ _id: -1 })
      .limit(30)
      .lean();

    res.status(200).json({
      cash,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/:adminId/all", async (req, res, next) => {
  try {
    const cash = await cashOpen
      .find({ adminId: req.params.adminId })
      .sort({ _id: -1 })
      .lean()
      .exec();

    res.status(200).json({
      cash,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  } finally {
    console.log("We do cleanup here");
  }
});

router.post("/:adminId", async (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let heure = d.getHours();
  let minute = d.getMinutes();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();

  let openDate = `${year}-${month}-${day}`;
  let heures = `${heure}:${minute}:${sec}`;
  try {
    const cash = new cashOpen({
      _id: new mongoose.Types.ObjectId(),
      adminId: req.params.adminId,
      openDate: openDate,
      cashFund: parseInt(req.body.cashFund),
      ouverture: heures,
      closing_cash: 0,
    });
    let result = await cash.save();
    req.io.sockets.emit(`${req.params.adminId}cashOpen`, result);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({
      error: e,
    });
  }
});

router.patch("/:adminId", async (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();
  let heure = d.getHours();
  let minute = d.getMinutes();
  let heures = `${heure}:${minute}:${sec}`;
  let closDate = `${year}-${month}-${day}`;
  try {
    let cash = await cashOpen.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          open: false,
          closeDate: closDate,
          fermeture: heures,
          closing_cash: req.body.closing_cash,
        },
      },
      { new: true }
    );

    req.io.sockets.emit(`${req.body.adminId}cashClose`, cash);
    res.status(201).json({
      message: "update ",
      resultat: cash,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

router.delete("/:adminId", (req, res, next) => {
  // console.log(req.query);
  cashOpen.findByIdAndRemove(req.query.Id, (error, success) => {
    if (error) {
      console.log(error);
    } else {
      res.status(201).json({
        message: "update ",
        resultat: success,
      });
    }
  });
});
module.exports = router;
