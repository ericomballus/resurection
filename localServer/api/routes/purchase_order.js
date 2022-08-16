const express = require("express");
const router = express.Router();
const tenant = require("../../getTenant");
let db = "maeri";
let ObjectId = require("mongoose").Types.ObjectId;

router.get("/", (req, res, next) => {
  console.log("router 1");
  res.json({
    ok: "ok",
  });
  /* req.tenant
    .find({ adminId: new ObjectId(req.query.adminId) }, "-v")
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.json({
        docs: result,
      });
    });*/
});

router.get("/:adminId", async (req, res, next) => {
  try {
    const vouchers = await req.tenant
      .find({
        adminId: req.query.db,
        managerSend: true,
        storeId: req.query.storeId,
      })
      // .populate("vendorId")
      .lean()
      .sort({ _id: -1 })
      .exec();
    // .limit(100);
    res.status(200).json(vouchers);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/:adminId/:id", async (req, res, next) => {
  try {
    const vouchers = await req.tenant
      .find({
        billId: req.params.id,
      })
      .lean()
      .exec();
    res.status(200).json(vouchers[0]);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/adminId/erico/:mballus", async (req, res, next) => {
  console.log("hello here", req.params);
  res.json({
    ok: "ok4",
  });
  /*  try {
    const vouchers = await req.tenant
      .find({
        billId: req.params.id,
      })
      .lean()
      .exec();
    res.status(200).json(vouchers[0]);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }*/
});

router.post("/", (req, res, next) => {
  req.tenant
    .find({
      localId: req.body.localId,
    })
    .lean()
    .exec()
    .then((bills) => {
      if (bills.length) {
        res.send(JSON.stringify({ success: "existe deja" }));
      } else {
        req.tenant
          .create(req.body)
          .then((resu) => {
            req.io.sockets.emit(`${req.body.adminId}purchaseOrder`, resu);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.patch("/", (req, res, next) => {
  console.log(req.body);
  req.tenant
    .findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true },
      function (error, voucher) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json(voucher);
        }
      }
    )
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

router.patch("/created", (req, res, next) => {
  req.tenant
    .find({
      localId: req.body.localId,
    })
    .lean()
    .exec()
    .then((bills) => {
      if (bills.length) {
        res.send(JSON.stringify({ success: "existe deja" }));
      } else {
        req.tenant
          .create(req.body)
          .then((resu) => {
            console.log(resu);
            req.io.sockets.emit(`${req.body.adminId}purchaseOrder`, resu);
            res.json(resu);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

function onlyBydateSelect(req, res) {
  console.log("hello hello");
  req.tenant
    .find({
      $or: [{ adminId: req.query.db }, { adminId: new ObjectId(req.query.db) }],
      created: {
        $gte: req.query.start,
        $lte: req.query.end,
      },
      // deleteAuth: true,
      storeId: req.query.storeId,
    })
    .then(function (docs) {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

module.exports = router;
