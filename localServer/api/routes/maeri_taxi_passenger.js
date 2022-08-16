const express = require("express");

const Passenger = require("../models/Maeri_Taxi_Passenger");

const router = express.Router();

router.post("/", async (req, res, next) => {
  //console.log("ici tenant1", tenant1);
  try {
    let mapUser = await Passenger.findOne({ phone: req.body.phone });
    if (mapUser) {
      res.status(400).json({
        error: "user exist with this phone number",
      });
    } else {
      const taxi = new Taxi({
        name: req.body.name,
        customer_phone: req.body.custumer_phone,
      });
      let newtaxi = await taxi.save();
      let url = req.protocol + "://" + req.get("host") + "/taxi/" + newtaxi._id;
      // let url = "https://www.google.com/";
      res.status(201).json({ data: newtaxi, url: url });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res, next) => {
  let Id = req.params.id;

  try {
    const result = await Passenger.find(Id).lean();
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/all/Passenger", async (req, res, next) => {
  try {
    const result = await Passenger.find({})
      // .populate("vendorId")
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.put("/Passenger", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };
  const update = { qrCode: req.body.qrCode };
  Passenger.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Passenger.remove({ _id: req.params.id })
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
