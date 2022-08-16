const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cashOpen = require("../models/Cash-opening");
const InventorySchema = require("../models/Inventory");
const productItemsSchema = require("../models/ProductItem");
const manufacturedSchema = require("../models/Product-manufactured-item");
const billardSchema = require("../models/Billard");
const productListSchema = require("../models/Product-List");
const gammeSchema = require("../models/Gamme");
const inventoryBuilder = require("../../utils/buildInventory");
router.get("/:adminId", (req, res, next) => {
  if (req.query.before) {
    req.tenant
      .find({ adminId: req.params.adminId, open: false })
      .sort({ $natural: -1 })
      .limit(1)
      .lean()
      .exec()
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.storeId) {
    req.tenant
      .find({
        adminId: req.params.adminId,
        open: true,
        storeId: req.query.storeId,
      })
      .lean()
      .exec()
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else {
    req.tenant
      .find({ adminId: req.params.adminId, open: true })
      .lean()
      .exec()
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.get("/:adminId/all", (req, res, next) => {
  // Invoice
  // req
  req.tenant
    .find({ adminId: req.params.adminId })
    // .select("product quantity _id")
    // .populate("product")
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json({
        docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:adminId/all/:last", (req, res, next) => {
  // Invoice
  // req
  console.log("derniere ouverture de caisse");
  req.tenant
    .find({
      adminId: req.params.adminId,
      storeId: req.query.storeId,
      //  $or: [{ desable: { $exists: false } }, { desable: { $ne: true } }],
      /* openDate: {
        $gt: req.query.olDate,
        $lte: req.query.newDate,
      },*/
    })
    .sort({ _id: -1 })
    .limit(1)
    // .select("product quantity _id")
    // .populate("product")
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/", async (req, res, next) => {
  //coming from local app server storage
  try {
    const resu = await req.tenant.create(req.body);
    res.status(200).json(resu);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/:adminId", (req, res, next) => {
  req.tenant
    .find({
      adminId: req.params.adminId,
      open: true,
      storeId: req.body.storeId,
    })
    .lean()
    .exec()
    .then(async (docs) => {
      if (docs.length > 0) {
        res.status(200).json({ message: docs[0] });
      } else {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let heure = d.getHours();
        let minute = d.getMinutes();
        let sec = d.getSeconds();
        let mili = d.getMilliseconds();
        let user = "noId";
        if (req.body.user) {
          user = req.body.user;
        }
        let openDate = `${year}-${month}-${day}`;
        let heures = `${heure}:${minute}:${sec}`;
        try {
          const resu = await req.tenant.create({
            _id: new mongoose.Types.ObjectId(),
            adminId: req.params.adminId,
            openDate: Date.now(),
            cashFund: parseInt(req.body.cashFund),
            ouverture: heures,
            closing_cash: 0,
            storeId: req.body.storeId,
            user: user,
          });
          const Products = mongoose.model("productitems", productItemsSchema);

          const docs = await Products.find({
            adminId: req.params.adminId,
            storeId: req.body.storeId,
          }).exec();
          const Manufactured = mongoose.model(
            "manufactureditemSchema",
            manufacturedSchema
          );
          /* req.tenancy.getModelByTenant(
            req.dbUse,
            "manufactureditemSchema",
            manufacturedSchema
          );*/
          const resto = await Manufactured.find({
            adminId: req.params.adminId,
            storeId: req.body.storeId,
          }).exec();
          const Billard = mongoose.model("billard", billardSchema);
          // req.tenancy.getModelByTenant(req.dbUse, "billard", billardSchema);
          const Service = await Billard.find({
            adminId: req.params.adminId,
            storeId: req.body.storeId,
          }).exec();

          const ProductList = mongoose.model("productlist", productListSchema);
          /*req.tenancy.getModelByTenant(
            req.dbUse,
            "productlist",
            productListSchema
          );*/
          const List = await ProductList.find({
            adminId: req.params.adminId,
            storeId: req.body.storeId,
          }).exec();

          const GammeList = mongoose.model("gamme", gammeSchema);
          /* req.tenancy.getModelByTenant(
            req.dbUse,
            "gamme",
            gammeSchema
          );*/
          const Gamme = await GammeList.find({
            adminId: req.params.adminId,
            storeId: req.body.storeId,
          }).exec();

          let tab = [];
          tab = [...docs, ...resto, ...Service, ...List, ...Gamme];
          const tenant = mongoose.model("inventory", InventorySchema);
          /* req.tenancy.getModelByTenant(
            req.dbUse,
            "inventory",
            InventorySchema
          );*/

          const end = await tenant.create({
            _id: new mongoose.Types.ObjectId(),
            cashOpening: resu._id,
            listsStart: tab,
            storeId: req.body.storeId,
          });
          req.io.sockets.emit(`${req.body.adminId}cashOpen`, resu);
          req.io.sockets.emit(
            `${req.body.adminId}${req.body.storeId}cashOpen`,
            resu
          );
          res.status(200).json({ message: resu });
        } catch (e) {
          console.error(e);
        } finally {
          console.log("We do cleanup here");
        }
      }
    })
    .catch((err) => {
      console.log("ouverture caisse error===>", err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/", (req, res, next) => {
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: req.body,
    },
    { new: true },
    (error, success) => {
      res.status(200).json(success);
    }
  );
});

router.patch("/:adminId", (req, res, next) => {
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

  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        open: false,
        closeDate: Date.now(),
        fermeture: heures,
        closing_cash: req.body.closing_cash,
        inventoryalreadyexists: true,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        const Products = mongoose.model("productitems", productItemsSchema);
        /* req.tenancy.getModelByTenant(
          req.dbUse,
          "productitems",
          productItemsSchema
        );*/
        Products.find({
          adminId: req.params.adminId,
          storeId: req.query.storeId,
        })
          .exec()
          .then(async (docs) => {
            //  console.log("=============", docs);
            const Manufactured = mongoose.model(
              "manufactureditemSchema",
              manufacturedSchema
            );
            /* req.tenancy.getModelByTenant(
              req.dbUse,
              "manufactureditemSchema",
              manufacturedSchema
            );*/
            Manufactured.find({
              adminId: req.params.adminId,
              storeId: req.query.storeId,
            })
              .exec()
              .then(async (resto) => {
                const Billard = mongoose.model("billard", billardSchema);
                /* req.tenancy.getModelByTenant(
                  req.dbUse,
                  "billard",
                  billardSchema
                );*/
                const Service = await Billard.find({
                  adminId: req.params.adminId,
                  storeId: req.query.storeId,
                }).exec();

                const ProductList = mongoose.model(
                  "productlist",
                  productListSchema
                );
                /* req.tenancy.getModelByTenant(
                  req.dbUse,
                  "productlist",
                  productListSchema
                );*/
                const List = await ProductList.find({
                  adminId: req.params.adminId,
                  storeId: req.query.storeId,
                }).exec();

                const GammeList = mongoose.model("gamme", gammeSchema);
                /* req.tenancy.getModelByTenant(
                  req.dbUse,
                  "gamme",
                  gammeSchema
                );*/
                const Gamme = await GammeList.find({
                  adminId: req.params.adminId,
                  storeId: req.query.storeId,
                }).exec();

                let tab = [];
                tab = [...docs, ...resto, ...Service, ...List, ...Gamme];
                const tenant2 = mongoose.model("inventory", InventorySchema);
                /* req.tenancy.getModelByTenant(
                  req.dbUse,
                  "inventory",
                  InventorySchema
                );*/
                tenant2.findOneAndUpdate(
                  { open: true, storeId: req.query.storeId },
                  {
                    $set: {
                      listsEnd: tab,
                      open: false,
                    },
                  },
                  { new: true },
                  (error, res) => {
                    if (error) {
                      console.log("erreur ", error);
                    } else {
                      inventoryBuilder(req, res, success);
                      req.io.sockets.emit(
                        `${req.query.db}${req.query.storeId}cashClose`,
                        success
                      );
                      /* res.status(201).json({
                        message: "update ",
                        resultat: success,
                      });*/
                    }
                  }
                );
              });
          });
      }
    }
  );
});
router.patch("/:adminId/makeInventory", (req, res, next) => {
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        makeInventory: true,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.body.adminId}makeInventory`, success);
        res.status(201).json({
          message: "update ",
          resultat: success,
        });
      }
    }
  );
});

router.delete("/:adminId", (req, res, next) => {
  // console.log(req.query);
  req.tenant.findByIdAndRemove(req.query.Id, (error, success) => {
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
