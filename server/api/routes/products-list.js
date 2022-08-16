const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const test = require("../../middleware/multytenant");
const checkDatabase = require("../../middleware/check_database");
const userSetting = require("../../utils/getUserSetting");
const router = express.Router();
let io = require("socket.io");
const warehouseTransaction = require("../../middleware/transactionItems");

let UPLOAD_PATH = "uploads";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post(
  "/:adminId",

  (req, res, next) => {
    req.tenant
      .create({
        _id: new mongoose.Types.ObjectId(),
        adminId: req.params.adminId,
        name: req.body.name,
        sellingPrice: req.body.sellingPrice,
        purchasingPrice: req.body.purchasingPrice,
        categoryName: req.body.categoryName,
        superCategory: req.body.superCategory,
        storeId: req.body.storeId,
        categoryId: req.body.categoryId,
        quantityToAlert: req.body.quantityToAlert,
      })
      .then((data) => {
        let result = data;
        result._id = data._id;

        req.io.sockets.emit(`${req.params.adminId}newProductList`, result);
        res.status(201).json({ message: "products list", data: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

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
      categoryId: req.body.categoryId,
      name: req.body.name,
    })
    .lean()
    .exec((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs.length >= 1) {
          if (req.body.super_warehouse) {
            req.tenant.findOneAndUpdate(
              { _id: docs[0]._id },
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
                    /* req.io.sockets.emit(
                      `${req.query.db}${req.body.storeId}billardItemRestore`,
                      success
                    );*/
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
              .json({ message: "products service", data: docs[0] });
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
    console.log(mongoose.connection.readyState);
    //req.model("Product")

    req.tenant.findById(imgId, (err, images) => {
      console.log(images);
      if (images) {
      } else {
        console.log(err);

        res.status(400).json({
          error: "document inexistant",
        });
      }
    });
  }
);

router.get(
  "/adminId/all",

  (req, res, next) => {
    req.tenant
      .find({ adminId: req.query.db, desabled: false })
      .lean()
      .exec((err, billards) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }

        /*  let tab = billards.reduce((r, a) => {
          r[a.superCategory] = [...(r[a.superCategory] || []), a];
          return r;
        }, {});
        arr = [];
      
        for (const property in tab) {
          arr.push(tab[property]);
        }  */
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

        /*  let tab = billards.reduce((r, a) => {
          r[a.superCategory] = [...(r[a.superCategory] || []), a];
          return r;
        }, {});
        arr = [];
      
        for (const property in tab) {
          arr.push(tab[property]);
        }  */
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

router.patch(
  "/:adminId",

  async (req, res, next) => {
    console.log(req.body);
    try {
      let doc = await req.tenant.findById({ _id: req.body.id }).exec();
      let settingArr = await userSetting(doc.adminId, req);

      let setting = settingArr[0];
      if (doc["tabitem"] && doc["tabitem"][doc["tabitem"].length - 1]) {
        let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

        let oldQuantity = parseInt(oldpack.newstock);
        let newpackitems = {
          oldstock: oldpack.newstock,
          newstock: parseInt(req.body.newquantity) + oldQuantity,
          //quantity est le stock ajouté
          quantity: parseInt(req.body.newquantity),
        };

        let bottle_full = 0;
        let bottle_empty = 0;
        let bottle_total = 0;

        if (setting.sale_Gaz) {
          if (doc.bottle_empty) {
            bottle_empty = doc.bottle_empty;
          }
          if (req.body.bottle_return) {
            bottle_empty = bottle_empty - req.body.newquantity;
          }
          if (bottle_empty < 0) {
            bottle_empty = 0;
          }
          if (doc.bottle_full) {
            bottle_full = doc.bottle_full;
          }
          if (doc.bottle_total) {
            bottle_total = doc.bottle_total;
          }
          bottle_full = doc.bottle_full + parseInt(req.body.newquantity);
          // doc.quantityStore;
          bottle_total = bottle_full + bottle_empty;
        }

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: doc.quantityItems + parseInt(req.body.newquantity),
              bottle_full: bottle_full,
              bottle_total: bottle_total,
              bottle_empty: bottle_empty,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.query.db}productlist`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
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
        let bottle_full = 0;
        let bottle_empty = 0;
        let bottle_total = 0;

        if (setting.sale_Gaz) {
          if (doc.bottle_total) {
            bottle_total = doc.bottle_total;
          }
          if (doc.bottle_empty) {
            bottle_empty = doc.bottle_empty;
          }
          if (req.body.bottle_return) {
            bottle_empty = bottle_empty - req.body.newquantity;
          }

          if (bottle_empty < 0) {
            bottle_empty = 0;
          }
          if (doc.bottle_full) {
            bottle_full = doc.bottle_full;
          }
          if (doc.bottle_total) {
            bottle_total = doc.bottle_total;
          }

          bottle_full = doc.bottle_full + parseInt(req.body.newquantity);
          // doc.quantityStore;
          bottle_total = bottle_full + bottle_empty;
        }

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: parseInt(req.body.newquantity),
              bottle_full: bottle_full,
              bottle_total: bottle_total,
              bottle_empty: bottle_empty,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.params.adminId}billardItem`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    }
    /*
    req.tenant
      .findById({ _id: req.body.id })
      .exec()
      .then(async (doc) => {
       
        if (doc["tabitem"] && doc["tabitem"][doc["tabitem"].length - 1]) {
          let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

          let oldQuantity = parseInt(oldpack.newstock);
          let newpackitems = {
            oldstock: oldpack.newstock,
            newstock: parseInt(req.body.newquantity) + oldQuantity,
            quantity: parseInt(req.body.newquantity),
          };

          let bottle_full = 0;
          let bottle_empty = 0;
          let bottle_total = 0;
          if (doc.bottle_full) {
            bottle_full = doc.bottle_full;
          }
          if (doc.bottle_empty) {
            bottle_empty = doc.bottle_empty;
          }
          if (doc.bottle_total) {
            bottle_total = doc.bottle_total;
          }
          bottle_full =
            doc.quantityItems +
            parseInt(req.body.newquantity) +
            doc.quantityStore;
          bottle_total = bottle_full + bottle_empty;

          req.tenant.findOneAndUpdate(
            { _id: req.body.id },
            {
              $push: { tabitem: newpackitems },
              $set: {
                quantityItems:
                  doc.quantityItems + parseInt(req.body.newquantity),
                bottle_full: bottle_full,
                bottle_total: bottle_total,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                req.io.sockets.emit(`${req.query.db}productlist`, success);
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                 
                });
              }
            }
          );
        } else {
         
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
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}billardItem`,
                  success
                );
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                 
                });
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
      */
  }
);

router.patch(
  "/:adminId/shoplist/store",

  (req, res, next) => {
    // console.log("je suis la", req.body);
    if (req.body.quantity > 0) {
      req.tenant
        .findById({ _id: req.body.id })
        .exec()
        .then((doc) => {
          //console.log(doc);

          let obj = {
            name: doc.name,
            quantityItems: req.body.quantity,
            sender: req.body.sender,
            productType: req.body.productType,
            idprod: doc._id,
            prod: doc,
          };
          const quantity = req.body.quantity;
          let newquantity = 0;
          let quantityToConfirm = 0;
          if (doc.quantityItems - quantity < 0) {
          } else {
            newquantity = doc.quantityItems - quantity;
          }
          if (doc.quantityToConfirm) {
            quantityToConfirm = doc.quantityToConfirm + quantity;
          } else {
            quantityToConfirm = quantity;
          }
          let quantityInStore = doc.quantityStore + quantity;
          req.tenant.findOneAndUpdate(
            { _id: req.body.id },
            {
              $set: {
                quantityItems: newquantity,
                quantityStore: quantityInStore,
                confirm: false,
                sender: req.body.sender,
                quantityToConfirm: quantityToConfirm,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                req.io.sockets.emit(`${req.params.adminId}shopList`, success);
                warehouseTransaction(req, obj, req.tenant);

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

router.patch("/:adminId/shoplist/store/confirm", (req, res, next) => {
  // console.log("je suis la", req.body);
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

router.delete("/:id", (req, res, next) => {
  let imgId = req.params.id;
  req.tenant.findOneAndUpdate(
    { _id: imgId },
    {
      $set: {
        desabled: true,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({
          message: "produit supprimé",
        });
      }
    }
  );
});
module.exports = router;
