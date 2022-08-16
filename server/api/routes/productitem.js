const express = require("express");
const router = express.Router();
const InventorySchema = require("../models/Inventory");
const mongoose = require("mongoose");
const fs = require("fs");
//var myWriteStream = fs.createWriteStream("../../serverLog.tx");
//constreq.tenant = require("../models/ProductItem");
const warehouseTransaction = require("../../middleware/transactionItems");
const glacerManager = require("../../middleware/manageGlacer");
const { ObjectId } = require("mongodb");
//handle incoming  Get request to /order
router.get(
  "/admin/:prodId",

  (req, res, next) => {
    // Packitems;
    if (req.query.retailer) {
      req.tenant
        .find({ adminId: req.query.retailer }, "-__v", "-tabitem")
        .populate("adminId")
        // .lean()
        .select("-tabitem")
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
        .find({ productId: req.params.prodId }, "-tabitem")
        .populate("adminId")
        .select("-tabitem")
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
  }
);

router.get(
  "/admin/product/to/update/pack/:productId",

  (req, res, next) => {
    req.tenant
      .find({ productId: req.params.productId })
      //.populate("productId")
      .select("-tabitem")
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
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
);

router.get(
  "/admin/product/to/aggregation/manager/:adminId/all",
  (req, res, next) => {
    req.tenant
      .find({ adminId: req.query.db, quantityStore: { $lt: 30 } }, "-tabitem")
      /*  .aggregate([
      {
        $match: {
          adminId: req.query.adminId,
        },
      },
    ])*/
      .select("-tabitem")
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
);

router.get(
  "/admin/product/to/aggregation/manager/:adminId/all/specificdate",
  async (req, res, next) => {
    let queryByStore = {};
    let query = {};
    if (req.query.cashOpen && req.query.cashClose) {
      query = {
        "tabitem.created": {
          $gte: new Date(req.query.cashOpen),
          $lte: new Date(req.query.cashClose),
        },
      };
    } else {
      query = {
        "tabitem.month": { $gte: parseInt(req.query.month) },
        "tabitem.year": { $gte: parseInt(req.query.year) },
      };
    }

    if (req.query.storeId !== "null") {
      queryByStore = {
        adminId: ObjectId(req.query.db),
        storeId: req.query.storeId,
      };
    } else {
      queryByStore = {
        adminId: ObjectId(req.query.db),
      };
    }

    req.tenant
      .aggregate([
        {
          $match: queryByStore,
        },
        {
          $unwind: "$tabitem",
        },
        {
          $match: query,
          // {
          // "tabitem.month": { $gte: parseInt(req.query.month) },
          //"tabitem.year": { $gte: parseInt(req.query.year) },
          // },
        },
        {
          $group: {
            _id: {
              id: "$tabitem.itemId",
              name: "$name",
              productItemId: "$_id",
            },
            quantity: {
              $sum: "$tabitem.quantity",
            },
            quantityOut: {
              $sum: "$tabitem.quantityOut",
            },
            itemsSold: {
              $push: {
                motif: "$tabitem.motif",
                out: "$tabitem.quantityOut",
                in: "$tabitem.quantity",
                monyh: { $month: "$tabitem.created" },
                year: { $year: "$tabitem.created" },
                day: { $dayOfMonth: "$tabitem.created" },
                hour: { $hour: "$tabitem.created" },
                minutes: { $minute: "$tabitem.created" },
                seconds: { $second: "$tabitem.created" },
                dayOfYear: { $dayOfYear: "$tabitem.created" },
                dayOfWeek: { $dayOfWeek: "$tabitem.created" },
                week: { $week: "$tabitem.created" },
                name: "$name",
                oldstock: "$tabitem.oldstock",
                newstock: "$tabitem.newstock",
              },
            },
          },
        },
        //  { $sort: { _id: -1 } },
      ])
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
);

//pour appli admin
router.get("/", (req, res, next) => {
  if (req.query.storeId && !req.query.aggregate) {
    req.tenant
      .find(
        {
          adminId: req.query.db,
          storeId: req.query.storeId,
          desabled: false,
          productId: { $ne: null },
        },
        "-__v"
      )
      .select()
      .sort({ name: 1 })
      .lean()
      .exec()

      .then((docs) => {
        // docs.filter((elt) => elt.)
        res.status(200).json({
          count: docs.length,
          items: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.qrcode) {
    req.tenant
      .find({ adminId: req.query.db }, "-__v")
      .sort({ name: 1 })
      // .populate("productId")
      //.populate("adminId")
      .select("-tabitem")
      .lean()
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)

        res.render("pages/qrcode", {
          prods: docs,
          url: req.protocol + "://" + req.get("host"),
          adminId:
            req.protocol +
            "://" +
            req.get("host") +
            `/productsitem/?db=${req.query.db}`,
          admin: req.query.db,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.aggregate) {
    sendAggregate(req, res);
  } else {
    req.tenant
      .find({ adminId: req.query.db }, "-__v")
      .sort({ name: 1 })
      .select("-tabitem")
      .lean()
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
        res.status(200).json({
          count: docs.length,
          items: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.get("/manufactureditem/:name/:IdAdmin", (req, res, next) => {
  req.tenant
    .find({ name: { $regex: req.params.name } })
    // .select("product quantity _id")
    // .populate("product")
    .exec()
    .then((docs) => {
      // docs.filter((elt) => elt.)
      res.status(200).json({
        Items: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/:adminId/product/items", (req, res, next) => {
  let product_name = req.body.name;
  let obj = {
    productId: req.body.productId,
    adminId: req.body.adminId,
    purchasingPrice: req.body.purchasingPrice,
    sellingPrice: req.body.sellingPrice,
    name: req.body.name,
    url: req.body.url,
    unitNameProduct: req.body.unitNameProduct,
    sizeUnitProduct: req.body.sizeUnitProduct,
    maeriId: req.body.maeriId,
    produceBy: req.body.produceBy,
    ristourne: req.body.ristourne,
    packSize: req.body.packSize,
    packPrice: req.body.packPrice,
    categoryName: req.body.categoryName,
    superCategory: req.body.superCategory,
    storeId: req.body.storeId,
    resourceList: req.body.resourceList,
  };
  req.tenant
    .find({
      productId: req.body.productId,
      storeId: req.body.storeId,
      adminId: req.body.adminId,
      maeriId: req.body.maeriId,
      desabled: false,
    })
    .exec()
    .then((docs) => {
      if (docs.length) {
        res.status(500).json({
          error: "product exist",
        });
      } else {
        req.tenant.create(obj).then((data) => {
          console.log(data);

          res.status(201).json({ message: "product items ", data: data });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: `product items ${product_name} exist in the same store and he is actif`,
      });
    });
});

router.patch("/:adminId", (req, res, next) => {
  req.tenant
    .findById({ _id: req.body.id })
    .exec()
    .then((doc) => {
      // console.log(doc["tabitem"]);

      if (doc["tabitem"][doc["tabitem"].length - 1]) {
        let oldpack = doc["tabitem"][doc["tabitem"].length - 1];
        // console.log(oldpack);
        // console.log(req.body.newquantity);
        let oldQuantity = parseInt(oldpack.newstock);
        let newpackitems = {
          oldstock: oldpack.newstock,
          //newstock est la somme des ajouts
          newstock: parseInt(req.body.newquantity) + oldQuantity,
          //quantity est le stock ajouté
          quantity: parseInt(req.body.newquantity),
        };

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: oldQuantity + parseInt(req.body.newquantity),
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.params.adminId}productItem`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      } else {
        //first addreq.tenants
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
              req.io.sockets.emit(`${req.params.adminId}productItem`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
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
});

router.patch(
  "/:adminId/more",

  (req, res, next) => {
    let tab = req.body.tab;

    if (!req.body.fromVendor) {
      if (req.body.multi_store) {
        updateStoreQuantity(req, tab);
      } else {
        tab.forEach((element) => {
          console.log(element);
          let id = element.id;
          req.tenant
            .findById({ _id: element.id })
            .exec()
            .then((doc) => {
              if (element.noRistourne) {
                let ristourneStock = doc.stockNoRistourne;
                req.tenant.findOneAndUpdate(
                  { _id: id },
                  {
                    $push: { noRistourne: { quantity: element.newquantity } },
                    $set: {
                      stockNoRistourne:
                        ristourneStock + parseInt(element.newquantity),
                    },
                  },
                  { new: true },
                  (error, success) => {
                    if (error) {
                      console.log(error);
                    } else {
                    }
                  }
                );
              }

              if (doc["tabitem"] && doc["tabitem"][doc["tabitem"].length - 1]) {
                // console.log("ici");
                // console.log(doc["tabitem"]);
                let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

                let oldQuantity = parseInt(oldpack.newstock);
                let newpackitems = {
                  oldstock: oldpack.newstock,
                  //newstock est la somme des ajouts
                  newstock: parseInt(element.newquantity) + oldQuantity,
                  //quantity est le stock ajouté
                  quantity: parseInt(element.newquantity),
                  itemId: doc._id,
                };

                req.tenant.findOneAndUpdate(
                  { _id: id },
                  {
                    $push: { tabitem: newpackitems },
                    $set: {
                      // quantityItems: oldQuantity + parseInt(element.newquantity),
                      quantityItems:
                        doc.quantityItems + parseInt(element.newquantity),
                    },
                  },
                  { new: true },
                  (error, success) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.io.sockets.emit(
                        `${req.params.adminId}productItem`,
                        success
                      );
                    }
                  }
                );
              } else {
                let newpackitems = {
                  newstock: element.newquantity,
                  oldstock: 0,
                  quantity: element.newquantity,
                  itemId: doc._id,
                };

                req.tenant.findOneAndUpdate(
                  { _id: id },
                  {
                    $push: { tabitem: newpackitems },
                    $set: {
                      quantityItems: parseInt(element.newquantity),
                    },
                  },
                  { new: true },
                  (error, success) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.io.sockets.emit(
                        `${req.params.adminId}productItem`,
                        success
                      );
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
      }
    } else {
      tab.forEach((element) => {
        req.tenant
          .find({ maeriId: element.maeriId, adminId: req.query.db })
          .exec()
          .then((result) => {
            let doc = result[0];
            let id = result[0]._id;
            // console.log(doc["tabitem"]);
            if (element.noRistourne) {
              let ristourneStock = doc.stockNoRistourne;

              req.tenant.findOneAndUpdate(
                { _id: id },
                {
                  $push: { noRistourne: { quantity: element.newquantity } },
                  $set: {
                    stockNoRistourne:
                      ristourneStock + parseInt(element.newquantity),
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                  }
                }
              );
            }

            if (doc["tabitem"][doc["tabitem"].length - 1]) {
              // console.log("ici");
              // console.log(doc["tabitem"]);
              let oldpack = doc["tabitem"][doc["tabitem"].length - 1];
              // console.log(oldpack);
              // console.log(req.body.newquantity);
              let oldQuantity = parseInt(oldpack.newstock);
              let newpackitems = {
                oldstock: oldpack.newstock,
                //newstock est la somme des ajouts
                newstock: parseInt(element.newquantity) + oldQuantity,
                //quantity est le stock ajouté
                quantity: parseInt(element.newquantity),
              };

              req.tenant.findOneAndUpdate(
                { _id: id },
                {
                  $push: { tabitem: newpackitems },
                  $set: {
                    quantityItems: oldQuantity + parseInt(element.newquantity),
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    req.io.sockets.emit(
                      `${req.params.adminId}productItem`,
                      success
                    );
                  }
                }
              );
            } else {
              //first addreq.tenants
              let newpackitems = {
                newstock: element.newquantity,
                oldstock: 0,
                quantity: element.newquantity,
              };

              req.tenant.findOneAndUpdate(
                { _id: id },
                {
                  $push: { tabitem: newpackitems },
                  $set: {
                    quantityItems: parseInt(element.newquantity),
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    req.io.sockets.emit(
                      `${req.params.adminId}productItem`,
                      success
                    );
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
    }

    res.status(201).json({
      message: "update ok....",
    });
  }
);

router.put("/:adminId", (req, res, next) => {
  //myWriteStream.write(req.url);
  // console.log("hello");
  // console.log(req.body);

  req.body.forEach((elt) => {
    let obj = { newquantity: elt["qty"], id: elt["item"]["_id"] };

    req.tenant
      .findById({ _id: obj.id })
      .exec()
      .then((doc) => {
        console.log(doc);

        if (doc["tabitem"][doc["tabitem"].length - 1]) {
          let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

          let oldQuantity = parseInt(oldpack.newstock);
          let newpackitems = {
            oldstock: oldpack.newstock,

            newstock: obj.newquantity + oldQuantity,
            //quantity est le stock ajouté
            quantity: obj.newquantity,
          };

          req.tenant.findOneAndUpdate(
            { _id: obj },
            {
              $push: { tabitem: newpackitems },
              $set: {
                quantityItems: oldQuantity + obj.newquantity,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}productItem`,
                  success
                );
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                  // professeur: prof
                });
              }
            }
          );
        } else {
          //first addreq.tenants
          let newpackitems = {
            newstock: obj.newquantity,
            oldstock: 0,
            quantity: obj.newquantity,
          };

          req.tenant.findOneAndUpdate(
            { _id: obj.id },
            {
              $push: { tabitem: newpackitems },
              $set: {
                quantityItems: obj.newquantity,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}productItem`,
                  success
                );
                res.status(201).json({
                  message: "update ",
                  resultat: success,
                  // professeur: prof
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
  });
  /*
   */
});

router.put(
  "/:adminId/update",

  (req, res, next) => {
    req.tenant
      .find({ productId: req.body.productId })
      .exec()
      .then((data) => {
        //  console.log("++++++++++++============++++++++++");
        // console.log(data);

        let id = data[0]["_id"];
        req.tenant.findOneAndUpdate(
          { _id: id },
          { $set: req.body },
          { new: true },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.params.adminId}productItem`, success);
              res.status(201).json({
                message: "ajouté ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      });
  }
);

router.put(
  "/:adminId/products/store",

  (req, res, next) => {
    // console.log("hello");
    //
    if (req.body.multi_store) {
      // console.log(req.body);
      console.log(req.body.storeId);
      req.tenant
        .find({ productId: req.body.productId, storeId: req.body.storeId })
        .exec()
        .then((prod) => {
          console.log(prod);
          let doc = prod[0];
          let storeId = "";
          if (req.body.storeId) {
            storeId = req.body.storeId;
          }
          let obj = {
            name: doc.name,
            quantityItems: req.body.quantity,
            idprod: doc._id,
            prod: doc,
            sender: req.body.sender,
          };
          const quantity = req.body.quantity;
          const itemStoreId = req.body.id; //id du product items du magasin principal
          let newquantity = doc.quantityItems + quantity;
          let stockwarehouse = quantity;
          // let quantityInStore = doc.quantityStore + quantity;
          if (doc.quantityToConfirm) {
            stockwarehouse = doc.quantityToConfirm + quantity;
          }
          req.tenant.findOneAndUpdate(
            { _id: doc._id },
            {
              $set: {
                quantityToConfirm: stockwarehouse,
                quantityItems: newquantity,
                itemStoreId: itemStoreId,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                warehouseTransaction(req, obj, req.tenant);
                req.io.sockets.emit(
                  `${req.params.adminId}productItemToWarehouseStore`,
                  success
                );
                req.io.sockets.emit(
                  `${req.params.adminId}productItemStore`,
                  success
                );
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
    }

    req.tenant
      .findById({ _id: req.body.id })
      .exec()
      .then((doc) => {
        console.log(doc);
        let obj = {
          name: doc.name,
          quantityItems: req.body.quantity,
          idprod: doc._id,
          prod: req.body.prod,
          sender: req.body.sender,
        };
        const quantity = req.body.quantity;
        let newquantity = doc.quantityItems - quantity;
        // let stockwarehouse = quantity;
        let stockwarehouse = 0;
        // let quantityInStore = doc.quantityStore + quantity;
        if (doc.quantityToConfirm) {
          // stockwarehouse = doc.quantityToConfirm + quantity;
          stockwarehouse = doc.quantityToConfirm;
        }
        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              //  quantityToConfirm: stockwarehouse,
              quantityItems: newquantity,
              quantityStore: doc.quantityStore + quantity + stockwarehouse,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              warehouseTransaction(req, obj, req.tenant);
              /* req.io.sockets.emit(
                `${req.params.adminId}productItemToWarehouse`,
                success
              );*/
              req.io.sockets.emit(`${req.params.adminId}productItem`, success);
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
  }
);

router.put(
  "/:adminId/products/store/consigne",

  (req, res, next) => {
    // console.log("hello");
    //
    req.tenant
      .findById({ _id: req.body._id })
      .exec()
      .then((doc) => {
        console.log(doc);

        req.tenant.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: {
              consigne: req.body.consigne,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              //  warehouseTransaction(req, obj, req.tenant);
              req.io.sockets.emit(
                `${req.params.adminId}productItemConsigne`,
                success
              );
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
  }
);

router.patch(
  "/:adminId/products/store",

  (req, res, next) => {
    if (req.body.quantity > 0) {
      req.tenant
        .findById({ _id: req.body.id })
        .exec()
        .then((doc) => {
          let obj = {
            name: doc.name,
            quantityItems: req.body.quantity,
            quantityInStore: doc.quantityItems,
            idprod: doc._id,
            prod: doc,
            sender: req.body.sender,
            storeId: req.body.storeId,
            senderId: req.body.senderId,
          };
          const quantity = req.body.quantity;
          newquantity = doc.quantityItems - quantity;
          // let quantityInStore = doc.quantityStore + quantity;
          // let stockwarehouse = quantity;
          let quantityToConfirm = quantity;
          if (doc.quantityToConfirm) {
            // stockwarehouse = doc.quantityToConfirm - quantity;
            quantityToConfirm = doc.quantityToConfirm + quantityToConfirm;
          }
          req.tenant.findOneAndUpdate(
            { _id: req.body.id },
            {
              $set: {
                quantityItems: newquantity,
                quantityToConfirm: quantityToConfirm,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                warehouseTransaction(req, obj);
                req.io.sockets.emit(
                  `${req.query.db}productItemToShop`,
                  success
                );
                req.io.sockets.emit(`${req.query.db}productItem`, success);
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

router.patch(
  "/:adminId/products/store/confirm",

  (req, res, next) => {
    //
    req.tenant
      .findOneAndUpdate(
        { _id: req.body.id },
        {
          confirmStore: 1,
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(success);
            let tab = [];
            tab.push(success);

            // saveInventaire(req, tab, success);
            const tenant = req.tenancy.getModelByTenant(
              req.dbUse,
              "inventory",
              InventorySchema
            );
            tenant
              .find({
                open: true,
                cashOpening: req.query.openCashDate,
                storeId: success.storeId,
              })
              .lean()
              .exec()
              .then((docs) => {
                if (docs && docs.length) {
                  let arr = docs[0]["listsStart"];
                  let index = arr.findIndex((elt) => {
                    return elt._id == success._id;
                  });
                  if (index >= 0) {
                    arr.splice(index, 1, success);
                    tenant.updateOne(
                      { _id: docs[0]["_id"] },
                      { $set: { listsStart: arr } },
                      { new: true },
                      function (error, success1) {
                        if (error) {
                          console.log(error);
                        } else {
                          // console.log("succes======++++++-----", success1);
                        }
                      }
                    );
                  } else {
                    arr.push(success);
                    tenant.updateOne(
                      { _id: docs[0]["_id"] },
                      { $set: { listsStart: arr } },
                      { new: true },
                      function (error, success1) {
                        if (error) {
                          console.log(error);
                        } else {
                          // console.log("succes======++++++-----2", success1);
                        }
                      }
                    );
                  }
                } else {
                  // console.log("succes======++++++-----33");
                  tenant.create({
                    _id: new mongoose.Types.ObjectId(),
                    cashOpening: req.query.openCashDate,
                    listsStart: tab,
                    adminId: req.params.adminId,
                  });
                }
              });

            req.io.sockets.emit(`${req.params.adminId}productItem`, success);
            res.status(201).json({
              message: "update ",
              resultat: success,
            });
          }
        }
      )
      // })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
);

router.patch(
  "/:adminId/products/store/confirm/glacer",

  (req, res, next) => {
    glacerManager(req, res);
  }
);

router.patch(
  "/:adminId/products/store/confirm/reset/quantity",

  (req, res, next) => {
    req.tenant.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          quantityItems: 0,
          quantityStore: 0,
          glace: 0,
          nonglace: 0,
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
          req.io.sockets.emit(`${req.params.adminId}productItem`, success);
          res.status(201).json({
            message: "update ",
            resultat: success,
            // professeur: prof
          });
        }
      }
    );
    //  })
    /*  .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      }); */
  }
);

router.delete("/:Id/:adminId", (req, res, next) => {
  req.tenant;
  // .findByIdAndDelete({ _id: req.params.Id })
  req.tenant
    .findOneAndUpdate(
      { productId: ObjectId(req.params.Id) },
      {
        $set: {
          desabled: true,
        },
      },
      { new: true }
    )
    .then((result) => {
      req.io.sockets.emit(`${req.params.adminId}productItemDelete`, result);
      res.status(200).json({
        message: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

saveInventaire = (req, tab, success) => {
  console.log(req.dbUse, req.query.openCashDate);
  return;
};

updateStoreQuantity = (req, tab) => {
  console.log("*******multi_store*****");
  tab.forEach((element) => {
    let productId = element.productId;
    req.tenant
      .find({ productId: productId, storeId: element.storeId })
      .exec()
      .then((doc) => {
        // console.log(doc["tabitem"]);

        if (element.noRistourne) {
          let ristourneStock = doc[0].stockNoRistourne;
          req.tenant.findOneAndUpdate(
            { _id: doc[0]._id },
            {
              $push: { noRistourne: { quantity: element.newquantity } },
              $set: {
                stockNoRistourne:
                  ristourneStock + parseInt(element.newquantity),
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
              }
            }
          );
        }

        if (doc[0]["tabitem"][doc[0]["tabitem"].length - 1]) {
          // console.log("ici");
          // console.log(doc["tabitem"]);
          let oldpack = doc[0]["tabitem"][doc[0]["tabitem"].length - 1];
          // console.log(oldpack);
          console.log("new quantity", element.newquantity);
          let oldQuantity = parseInt(oldpack.newstock);
          let newpackitems = {
            oldstock: oldpack.newstock,
            //newstock est la somme des ajouts
            newstock: parseInt(element.newquantity) + oldQuantity,
            //quantity est le stock ajouté
            quantity: parseInt(element.newquantity),
          };

          req.tenant.findOneAndUpdate(
            { _id: doc[0]._id },
            {
              $push: { tabitem: newpackitems },
              $set: {
                // quantityItems: oldQuantity + parseInt(element.newquantity),
                quantityItems:
                  doc[0].quantityItems + parseInt(element.newquantity),
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                console.log("-------sucesss=====", success);
                req.io.sockets.emit(
                  `${req.params.adminId}productItemStore`,
                  success
                );
                res.status(200).json({
                  hello: success,
                });
              }
            }
          );
        } else {
          //first addreq.tenants

          let newpackitems = {
            newstock: element.newquantity,
            oldstock: 0,
            quantity: element.newquantity,
          };

          req.tenant.findOneAndUpdate(
            { _id: doc[0]._id },
            {
              $push: { tabitem: newpackitems },
              $set: {
                quantityItems: parseInt(element.newquantity),
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log(error);
              } else {
                console.log("-------sucesss=====", success);
                req.io.sockets.emit(
                  `${req.params.adminId}productItemStore`,
                  success
                );
                res.status(200).json({
                  hello: success,
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
  });
};

sendAggregate = (req, res) => {
  req.tenant
    .aggregate([
      {
        $match: {
          adminId: ObjectId(req.query.db),
          storeId: req.query.storeId,
        },
      },
      {
        $unwind: "$tabitem",
      },

      {
        $group: {
          _id: {
            id: "$tabitem.itemId",
            name: "$name",
            packSize: "$packSize",
            quantityToConfirm: "$quantityToConfirm",
            quantityToConfirm: "$quantityToConfirm",
            quantityStore: "$quantityStore",
            quantityItems: "$quantityItems",
            sellingPrice: "$sellingPrice",
          },
          quantity: {
            $sum: "$tabitem.quantity",
          },
          quantityOut: {
            $sum: "$tabitem.quantityOut",
          },
          itemsSold: {
            $push: {
              motif: "$tabitem.motif",
              out: "$tabitem.quantityOut",
              in: "$tabitem.quantity",
              monyh: { $month: "$tabitem.created" },
              year: { $year: "$tabitem.created" },
              day: { $dayOfMonth: "$tabitem.created" },
              hour: { $hour: "$tabitem.created" },
              minutes: { $minute: "$tabitem.created" },
              seconds: { $second: "$tabitem.created" },
              dayOfYear: { $dayOfYear: "$tabitem.created" },
              dayOfWeek: { $dayOfWeek: "$tabitem.created" },
              week: { $week: "$tabitem.created" },
              name: "$name",
              oldstock: "$tabitem.oldstock",
              newstock: "$tabitem.newstock",
              quantity: "$tabitem.quantity",
            },
          },
        },
      },
      //  { $sort: { _id: -1 } },
    ])
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = router;
