const express = require("express");
const mongoose = require("mongoose");
const FIFO = require("../models/Fifo");
const Product = require("../models/Product-List");
const checkDatabase = require("../../middleware/check_database");

const router = express.Router();
let io = require("socket.io");

router.post("/:adminId", checkDatabase.db, async (req, res, next) => {
  const docs = new FIFO(req.body);
  const doc = await FIFO.save();
  req.io.sockets.emit(`${req.params.adminId}FIFO`, doc);
  res.status(201).json(doc);
});

router.get("/", checkDatabase.db, (req, res, next) => {
  FIFO.find({}, "-__v")
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
    let docs = await FIFO.find({ adminId: req.params.adminId })
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

router.get("/:adminId/:productId", checkDatabase.db, async (req, res, next) => {
  //Category
  try {
    let docs = await FIFO.find({
      productId: req.params.productId,
      quantity: { $gt: 0 },
    })
      // .populate("authorId patientId senderId")
      .sort({ _id: 1 })
      .exec();
    res.status(200).json(docs.reverse());
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get(
  "/stock/expired/:stockId",
  checkDatabase.db,
  async (req, res, next) => {
    //Category
    try {
      let doc = await FIFO.findOne({
        _id: req.params.stockId,
      })
        // .populate("authorId patientId senderId")
        .exec();
      let expire = new Date(doc.expireAt).getTime();
      let date2 = new Date().getTime();
      let diff = new Date(expire - date2);
      let y = diff.getUTCFullYear() - 1970;
      let m = diff.getUTCMonth();
      let d = diff.getUTCDate();

      res.status(200).json({ year: y, month: m, day: d });
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
  const update = req.body;
  try {
    let result = await FIFO.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/enable/:id", checkDatabase.db, async (req, res, next) => {
  let Id = req.params.id;
  const filter = { _id: Id };
  const update = req.body;
  update["actif"] = true;
  update["isUse"] = true;
  try {
    let result = await FIFO.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    await require("../../utils/setStock").updateUseStock(req.body, req);

    req.io.sockets.emit(`${req.query.db}fifoActived`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/stock/desable/:id", checkDatabase.db, async (req, res, next) => {
  let Id = req.params.id;
  const filter = { _id: Id };
  const update = req.body;
  update["actif"] = false;
  update["isUse"] = false;
  try {
    let result = await FIFO.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    await require("../../utils/setStock").desableUseStock(req.body, req);

    req.io.sockets.emit(`${req.query.db}fifoActived`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
