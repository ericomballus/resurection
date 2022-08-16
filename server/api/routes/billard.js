const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const Billard = require("../models/Billard");
const PurchaseSchema = require("../models/Purchase");
const test = require("../../middleware/multytenant");
const checkDatabase = require("../../middleware/check_database");
const warehouseTransaction = require("../../middleware/transactionItems");
const Transaction = require("../models/Production_Transaction");
const router = express.Router();
let io = require("socket.io");

let UPLOAD_PATH = "uploads";
if (process.platform === "win32") {
  UPLOAD_PATH = "uploads";
} else if (process.platform === "linux") {
  //found = "/home/ubuntu/elpis/server/uploads/" + images.filename;
  UPLOAD_PATH = require("../../config").IMAGE_URL_PATH;
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post("/:adminId", upload1.single("image"), (req, res, next) => {
  let bonus = 0;
  if (req.body.bonus) {
    //  bonus = req.body.bonus;
  }
  console.log(req.body);
  req.tenant
    .create({
      _id: new mongoose.Types.ObjectId(),
      filename: req.file.filename,
      originalname: req.file.originalname,
      adminId: req.query.db,
      name: req.body.name,
      sellingPrice: req.body.sellingPrice,
      purchasingPrice: req.body.purchasingPrice,
      categoryName: req.body.categoryName,
      categoryId: req.body.categoryId,
      superCategory: req.body.superCategory,
      storeId: req.body.storeId,
      // bonus: bonus,
      resourceList: JSON.parse(req.body.resourceList),
    })
    .then((data) => {
      let url =
        req.protocol +
        "://" +
        req.get("host") +
        "/billard/" +
        data._id +
        "?db=" +
        req.params.adminId;
      console.log(data);
      let result = { data: data, url: url };
      req.io.sockets.emit(`${req.query.db}newProductService`, result);
      // req.io.sockets.emit(`${req.query.db}billardItem`, result);
      res.status(201).json({ message: "products service", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.post("/:adminId/:transfer", (req, res, next) => {
  let bonus = 0;
  if (req.body.bonus) {
    bonus = req.body.bonus;
  }
  req.tenant
    .find({
      adminId: req.body.adminId,
      desabled: false,
      storeId: req.body.storeId,
      filename: req.body.filename,
      categoryId: req.body.categoryId,
      name: req.body.name,
    })
    .lean()
    .exec((err, billards) => {
      if (err) {
        console.log(err);
      } else {
        if (billards.length >= 1) {
          if (req.body.super_warehouse) {
            req.tenant.findOneAndUpdate(
              { _id: billards[0]._id },
              {
                $push: { idList: req.body.productId },
              },
              { new: true },
              (error, success) => {
                if (error) {
                  console.log(error);
                  res.status(500).json(error);
                } else {
                  if (req.body.storeId) {
                    req.io.sockets.emit(
                      `${req.query.db}${req.body.storeId}billardItemRestore`,
                      success
                    );
                  }
                  res
                    .status(201)
                    .json({ message: "products service", data: success });
                }
              }
            );
          } else {
            res
              .status(201)
              .json({ message: "products service", data: billards[0] });
          }
        } else {
          req.tenant
            .create(req.body)
            .then((data) => {
              let result = { data: data, url: data.url };
              req.io.sockets.emit(`${req.query.db}newProductService`, result);
              // req.io.sockets.emit(`${req.body.adminId}billardItem`, result);
              res.status(201).json({ message: "products service", data: data });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
});

router.get(
  "/:id",

  (req, res, next) => {
    let imgId = req.params.id;

    req.tenant.findById(imgId, (err, images) => {
      if (!err && images) {
        // fs.access(path.join(UPLOAD_PATH, images.filename), fs.F_OK, (error) => {
        let found = "";
        found = path.join(UPLOAD_PATH, images.filename);
        if (process.platform === "win32") {
          found = path.join(UPLOAD_PATH, images.filename);
        } else if (process.platform === "linux") {
          found = require("../../config").IMAGE_URL_PATH + images.filename;
        }
        fs.access(found, fs.F_OK, (error) => {
          if (error) {
            console.log(error);
            res.status(500).json({
              message: "image inexistante",
              error: error,
            });
            return;
          }

          res.setHeader("Content-Type", "image/jpeg");
          /* fs.createReadStream(path.join(UPLOAD_PATH, images.filename)).pipe(
            res
          );*/
          fs.createReadStream(found).pipe(res);
        });
      } else {
        console.log(err);
        res.status(500).json({
          message: "document inexistant",
          error: err,
        });
      }
    });
  }
);

router.get(
  "/adminId/all",

  (req, res, next) => {
    let query = {};
    if (req.query.storeId) {
      query = {
        adminId: req.query.db,
        desabled: false,
        storeId: req.query.storeId,
      };
    } else {
      query = {
        adminId: req.query.db,
        desabled: false,
      };
    }
    req.tenant
      .find(query)
      .lean()
      .exec((err, billards) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        /* for (let i = 0; i < billards.length; i++) {
          // var img = products[i];
          var img = billards[i];
          if (img.filename) {
            img.url =
              req.protocol +
              "://" +
              req.get("host") +
              "/billard/" +
              img._id +
              "?db=" +
              req.query.db;
          }
        }*/
        res.json({
          product: billards,
        });
      });
  }
);
router.get(
  "/adminId/for/shop",

  (req, res, next) => {
    req.tenant
      .find({
        adminId: req.query.db,
        desabled: false,
        storeId: req.query.storeId,
      })
      .lean()
      .exec((err, billards) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        for (let i = 0; i < billards.length; i++) {
          // var img = products[i];
          var img = billards[i];
          if (img.filename) {
            img.url =
              req.protocol +
              "://" +
              req.get("host") +
              "/billard/" +
              img._id +
              "?db=" +
              req.query.db;
          }
        }
        res.json({
          product: billards,
        });
      });
  }
);
router.patch("/", async (req, res, next) => {
  let Id = req.body._id;

  const filter = { _id: Id };
  const update = req.body;
  console.log(update);
  try {
    let result = await req.tenant.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

router.patch("/:adminId", async (req, res, next) => {
  console.log(req.body);

  req.tenant
    .findById({ _id: req.body.id })
    .exec()
    .then((doc) => {
      let adminId = doc.adminId;
      if (doc["tabitem"] && doc["tabitem"][doc["tabitem"].length - 1]) {
        let oldpack = doc["tabitem"][doc["tabitem"].length - 1];
        let oldQuantity = parseInt(oldpack.newstock);
        let newpackitems = {
          oldstock: oldpack.newstock,
          newstock: parseInt(req.body.newquantity) + oldQuantity,
          //quantity est le stock ajouté
          quantity: parseInt(req.body.newquantity),
        };

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: doc.quantityItems + parseInt(req.body.newquantity),
            },
          },
          { new: true },
          async (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.query.db}billardItem`, success);
              if (req.body.employeId && req.body.production) {
                //let employe = await require("../../utils/getEmploye")(req);
                req.body["quantityInStock"] = doc.quantityItems;
                req.body["quantity"] = parseInt(req.body.newquantity);
                const trans = new Transaction(req.body);
                let latransaction = await trans.save();
                console.log(latransaction);
              }
              if (doc.storeId) {
                req.io.sockets.emit(
                  `${req.query.db}${doc["storeId"]}billardItemRestore`,
                  success
                );

                req.io.sockets.emit(
                  `${req.query.db}${doc["storeId"]}billardItem`,
                  success
                );
              }
              if (req.body.purchase) {
                let docu = req.body.purchase;
                const Purchase = req.tenancy.getModelByTenant(
                  req.dbUse,
                  "purchase",
                  PurchaseSchema
                );
                await Purchase.findOneAndUpdate(
                  { _id: docu._id },
                  {
                    $set: docu,
                  },
                  { new: true },
                  (error, result) => {
                    if (error) {
                      console.log(error);
                    }

                    if (result["managerConfirm"]) {
                      req.io.sockets.emit(
                        `${result.adminId}managerConfirm`,
                        result
                      );
                    }
                  }
                );
              }
              if (req.query.transaction) {
                const redirectUrl = `/refueling?db=${req.query.db}`;
                res.redirect(redirectUrl);
              } else {
                // req.io.sockets.emit(`${req.query.db}billardItem`, success);
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                });
              }
            }
          }
        );
      } else {
        //first add productitems
        let newpackitems = {
          newstock: req.body.newquantity,
          oldstock: 0,
          quantity: req.body.newquantity,
        };

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: parseInt(req.body.newquantity),
            },
          },
          { new: true },
          async (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.query.db}billardItem`, success);
              if (req.body.storeId) {
                req.io.sockets.emit(
                  `${req.query.db}${req.body.storeId}billardItemRestore`,
                  success
                );
                req.io.sockets.emit(
                  `${req.query.db}${doc["storeId"]}billardItem`,
                  success
                );
              }
              if (req.body.employeId && req.body.production) {
                //let employe = await require("../../utils/getEmploye")(req);
                req.body["quantityInStock"] = doc.quantityItems;
                req.body["quantity"] = parseInt(req.body.newquantity);
                const trans = new Transaction(req.body);
                let latransaction = await trans.save();
                console.log(latransaction);
              }
              if (req.body.purchase) {
                let docu = req.body.purchase;
                const Purchase = req.tenancy.getModelByTenant(
                  req.dbUse,
                  "purchase",
                  PurchaseSchema
                );
                await Purchase.findOneAndUpdate(
                  { _id: docu._id },
                  {
                    $set: docu,
                  },
                  { new: true },
                  (error, result) => {
                    if (error) {
                      console.log(error);
                    }

                    if (result["managerConfirm"]) {
                      req.io.sockets.emit(
                        `${result.adminId}managerConfirm`,
                        result
                      );
                    }
                  }
                );
              }
              if (req.query.transaction) {
                const redirectUrl = `/refueling?db=${req.query.db}`;
                res.redirect(redirectUrl);
              } else {
                // req.io.sockets.emit(`${req.query.db}billardItem`, success);

                res.status(201).json({
                  message: "update ",
                  resultat: success,
                  // professeur: prof
                });
              }
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

router.patch(
  "/:adminId/billard/store",

  (req, res, next) => {
    if (req.body.quantity > 0) {
      req.tenant
        .findById({ _id: req.body.id })
        .exec()
        .then((doc) => {
          if (doc.storeId) {
            req.body["storeId"] = doc.storeId;
          }
          let obj = {
            name: doc.name,
            quantityItems: req.body.quantity,
            sender: req.body.sender,
            productType: req.body.productType,
            storeId: doc.storeId,
            adminId: req.params.adminId,
            senderId: req.body.senderId,
          };
          const quantity = req.body.quantity;
          let newquantity = doc.quantityItems - quantity;
          let quantityInStore = doc.quantityStore + quantity;
          req.tenant.findOneAndUpdate(
            { _id: req.body.id },
            {
              $set: {
                quantityItems: newquantity,
                quantityStore: quantityInStore,
                confirm: false,
                sender: req.body.sender,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                warehouseTransaction(req, obj);
                if (success.storeId) {
                  req.io.sockets.emit(
                    `${req.params.adminId}${success["storeId"]}billardItemRestore`,
                    success
                  );
                }
                req.io.sockets.emit(`${req.params.adminId}billard`, success);
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                  // professeur: prof
                });
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: err,
          });
        });
    } else {
      res.status(400).json({
        error: "quantity to add must greather than 0",
      });
    }
  }
);

router.patch("/:adminId/billard/store/confirm", (req, res, next) => {
  req.tenant
    .findById({ _id: req.body.id })
    .exec()
    .then((doc) => {
      //console.log(doc);
      tenant1.model("Billard").findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            confirm: true,
            receiver: req.body.receiver,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
          } else {
            warehouseTransaction(req, obj);
            req.io.sockets.emit(`${req.params.adminId}billardConfirm`, success);
            res.status(201).json({
              message: "update ",
              resultat: success,
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

router.patch(
  "/:adminId/products/store/confirm/reset/quantity",

  (req, res, next) => {
    req.tenant.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          quantityItems: 0,
          quantityStore: 0,
          quantityToConfirm: 0,
          quantityToConfirm: 0,
          tabitem: [],
        },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          // warehouseTransaction(req, obj);
          req.io.sockets.emit(`${req.params.adminId}billardItem`, success);
          res.status(201).json({
            message: "update ",
            resultat: success,
          });
        }
      }
    );
  }
);

router.delete("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant
    .remove({ _id: imgId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "produit supprimé",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

function superManager(req, res) {}
module.exports = router;
