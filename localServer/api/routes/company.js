const express = require("express");
const mongoose = require("mongoose");
const Company = require("../models/Company_Setting");
const test = require("../../middleware/multytenant");
const router = express.Router();
const checkDatabase = require("../../middleware/check_database");

router.post("/:adminId", (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();

  let theDate = `${year}-${month}-${day}`;
  req.tenant
    .create({
      created: theDate,
      name: req.body.name,
      adminId: req.params.adminId,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      ip: req.body.ip,
      phoneNumber: req.body.phoneNumber,
      stock_min: req.body.stock_min,
      stock_min_aut: req.body.stock_min_aut,
      macServer: req.body.macServer,
      pied_facture: req.body.pied_facture,
      entete_facture: req.body.entete_facture,
      use_resource: req.body.use_resource,
      use_wifi: req.body.use_wifi,
      use_desktop: req.body.use_desktop,
      companyMail: req.body.companyMail,
      manageStockWithService: req.body.manageStockWithService,
      productDisplayType: req.body.productDisplayType,
      multi_store: req.body.multi_store,
      register_customer: req.body.register_customer,
      use_bonus: req.body.use_bonus,
      use_gamme: req.body.use_gamme,
      use_same_variety: req.body.use_same_variety,
    })
    .then((company) => {
      console.log(company);
      res.status(201).json({ message: "ok ok product", data: company });
    });
});

//take all products
router.get(
  "/:adminId",

  (req, res, next) => {
    // req
    req.tenant
      .find(
        {
          adminId: req.params.adminId,
        },
        "-__v"
      )
      .lean()
      .exec((err, company) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        res.json({
          company: company,
        });
      });
  }
);

router.delete(
  "/:id/:adminId",

  (req, res, next) => {
    let comId = req.params.id;
    let adminId = req.params.adminId;
    //Category
    req.tenant
      .remove({ _id: comId })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "company Deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  console.log(req.body);
  req.tenant
    .findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          req.io.sockets.emit(`${req.body.adminId}newSetting`, success);
          res.status(201).json({
            company: success,
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
