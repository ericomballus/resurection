const express = require("express");
const router = express.Router();
const tenant = require("../../getTenant");
router.get("/", (req, res, next) => {
  req.tenant
    .find({}, "-v")
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.json(docs);
    });
});

router.get("/admin/:adminId", (req, res, next) => {
  req.tenant
    .find(
      { cashOpening: req.query.cashOpening, adminId: req.query.adminId },
      "-v"
    )
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      console.log("hello inventaire ici here ===>", result);
      let Cash = tenant.getModelByTenant(db, "cashopens", cashOpeningSchema);
      Cash.findById(req.query.cashOpening, function (err, cash) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            docs: result,
            cash: cash,
          });
        }
      });
    });
});

router.post("/", (req, res, next) => {});

router.post("/:storeId", (req, res, next) => {});

router.patch("/", (req, res, next) => {
  req.tenant
    .updateOne(
      { _id: req.body._id },
      { $set: { reimbursed: 2 } },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            bill: success,
          });
        }
      }
    )
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});
module.exports = router;
