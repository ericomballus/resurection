const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");
const builder = require("../../middleware/builder");
const Product = require("../models/Product");
const PackitemsSchema = require("../models/ProductPackItem");
const Pack = require("../models/ProductPack");
const test = require("../../middleware/multytenant");
const productItemsSchema = require("../models/ProductItem");
const createProductAndPack = require("../../utils/createProductItem");
const updateProductAndPack = require("../../utils/updateProduct");
const router = express.Router();
//const resizer = require("node-image-resizer");
let io = require("socket.io");
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

router.post("/:adminId", upload1.single("image"), async (req, res, next) => {
  if (req.body.packPrice) {
    req.body.packPrice = parseInt(req.body.packPrice);
  }
  if (req.body.packSize) {
    req.body.packSize = parseInt(req.body.packSize);
  }
  if (req.body.sellingPackPrice) {
  }
  if (req.body.resourceList) {
    req.body.resourceList = JSON.parse(req.body.resourceList);
  } else {
    req.body.resourceList = [];
  }
  req.tenant
    .create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      adminId: req.params.adminId,
      name: req.body.name,
      purchasingPrice: req.body.purchasingPrice,
      sellingPrice: req.body.sellingPrice,
      sellingPackPrice: req.body.sellingPackPrice,
      capacity: req.body.capacity,
      description: req.body.description,
      categoryId: req.body.categoryId,
      unitName: req.body.unitName,
      sizeUnit: req.body.sizeUnit,
      // url: req.body.url,
      maeriId: req.body.maeriId,
      sizeUnit: req.body.sizeUnit,
      unitName: req.body.unitName,
      produceBy: req.body.produceBy,
      ristourne: req.body.ristourne,
      packSize: req.body.packSize,
      packPrice: req.body.packPrice,
      categoryName: req.body.categoryName,
      superCategory: req.body.superCategory,
      storeId: req.body.storeId,
      resourceList: req.body.resourceList,
    })
    .then(async (product) => {
      product["productId"] = product._id;
      product["test"] = "maeri";

      console.log(product);
      product["url"] =
        req.protocol +
        "://" +
        req.get("host") +
        "/products/" +
        product._id +
        "?db=" +
        req.params.adminId;
      let endOperation = await createProductAndPack(req, res, product);
      req.io.sockets.emit(`${req.params.adminId}newProduct`, product);
      res.status(201).json({ message: "ok ok product", data: product });
    });
  // .then(data => {
  //   res.status(201).json({ message: "ok ok product", data: data });
  // });
});

router.post("/save/image/from/maeri/:adminId", (req, res, next) => {
  let product_name = req.body.name;
  req.tenant
    .find({
      //productId: req.body.productId,
      storeId: req.body.storeId,
      adminId: req.body.adminId,
      maeriId: req.body.maeriId,
      desabled: false,
    })
    .exec()
    .then(async (docs) => {
      if (docs.length) {
        res.status(500).json({
          error: "product exist",
        });
      } else {
        req.tenant
          .create({
            filename: req.body.filename,
            originalName: req.body.originalname,
            adminId: req.params.adminId,
            name: req.body.name,
            purchasingPrice: req.body.purchasingPrice,
            sellingPrice: req.body.sellingPrice,
            capacity: req.body.capacity,
            description: req.body.description,
            categoryId: req.body.categoryId,
            unitName: req.body.unitName,
            sizeUnit: req.body.sizeUnit,
            url: req.body.url,
            maeriId: req.body.maeriId,
            sizeUnit: req.body.sizeUnit,
            unitName: req.body.unitName,
            produceBy: req.body.produceBy,
            ristourne: req.body.ristourne,
            packSize: req.body.packSize,
            packPrice: req.body.packPrice,
            categoryName: req.body.categoryName,
            superCategory: req.body.superCategory,
            storeId: req.body.storeId,
          })
          .then(async (product) => {
            product["test"] = "maeri";
            // product["url"] = req.protocol + "://" + req.get("host") + product._id;
            product["productId"] = product._id;
            product["test"] = "maeri";
            product["url"] =
              req.protocol +
              "://" +
              req.get("host") +
              "/maeriproducts/" +
              req.body.maeriId +
              "?db=" +
              req.params.adminId;
            let endOperation = await createProductAndPack(req, res, product);

            req.io.sockets.emit(`${req.params.adminId}newProduct`, product);
            res.status(201).json({ message: "ok ok product", data: product });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: `product ${product_name} exist in the same store and he is actif`,
      });
    });
});

router.post(
  "/:adminId/productitems",

  (req, res, next) => {
    let prodId = req.body.productId;
    const productitem = {
      quantity: req.body.quantity,
    };

    req.tenant.findById(prodId, (err, product) => {
      let prod = product.productitems;
      if (err) {
        res.sendStatus(400);
      }
      if (product.productitems[prod.length - 1]) {
        //console.log("je suis la merci");
        let oldprod = product.productitems[prod.length - 1];

        let newprod = {
          oldstock: oldprod.quantity,
          newstock: req.body.quantity + oldprod.quantity,
          quantity: req.body.quantity,
        };

        req.tenant.findOneAndUpdate(
          { _id: prodId },
          { $push: { productitems: newprod } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
              res.status(201).json({
                message: "ajouté ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      } else {
        //first add productitems
        let newprod = {
          newstock: req.body.quantity,
          quantity: req.body.quantity,
        };

        req.tenant.findOneAndUpdate(
          { _id: prodId },
          { $push: { productitems: newprod } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
              res.status(201).json({
                message: "ajouté ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      }
    });
  }
);

//take all products
router.get("/adminId/:numid", (req, res, next) => {
  req.tenant
    .find({ adminId: req.params.numid }, "-__v")
    .lean()
    .exec((err, products) => {
      console.log("procust all here");
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      if (Array.isArray(products)) {
        for (let i = 0; i < products.length; i++) {
          // var img = images[i];
          var img = products[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/products/" +
            img._id +
            `?db=${req.query.db}&filename=${img.filename}`;
        }
        // lecache = { products: images };
        // cache.set;
        res.json({
          products: products.reverse(),
        });
      } else {
        console.log("error");
      }
    });
});

router.get("/adminId/:name/:numid", (req, res, next) => {
  //Product.find({ adminId: req.params.numid }, "-__v")
  // req.test3.subleaseMiddleware();

  req.tenant
    .find({ name: { $regex: req.params.name } })
    .lean()
    .exec((err, products) => {
      console.log(products);
      if (err) {
        res.status(500).json({
          error: err,
        });
      }

      for (let i = 0; i < products.length; i++) {
        // var img = products[i];
        var img = products[i];
        img.url =
          req.protocol +
          "://" +
          req.get("host") +
          "/products/" +
          img._id +
          "?db=" +
          req.query.db;
      }
      // lecache = { products: products };
      // cache.set;
      res.json({
        product: products,
      });
    });
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;

  req.tenant.findById(imgId, (err, images) => {
    if (!err && images) {
      let found = path.join(UPLOAD_PATH, images.filename);
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

        fs.createReadStream(found).pipe(res);
      });
    } else {
      console.log(err);

      res.status(400).json({
        error: "document inexistant",
      });
    }
  });
});

router.get("/adminId/get/one/:id", (req, res, next) => {
  req.tenant
    .find({ _id: req.params.id, desabled: false }, "-__v")
    .lean()
    .exec((err, product) => {
      console.log(product);
      if (err) {
        res.status(500).json({
          error: err,
        });
      }

      res.status(200).json({
        product,
      });
    });
});

router.delete("/:id/:adminId", (req, res, next) => {
  let imgId = req.params.id;

  req.tenant
    .findOneAndUpdate(
      { _id: imgId },
      { $set: { desabled: true } },
      { new: true }
    )
    .exec()
    .then((result) => {
      req.io.sockets.emit(`${req.params.adminId}deleteProduct`, imgId);
      res.status(200).json({ message: result });
    });
});
// for update product
router.post(
  "/product/update/admin/db",

  (req, res, next) => {
    const id = req.body._id;
    const supId = req.body._id;
    //console.log(req.body);

    req.tenant
      .findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
      .exec()
      .then((result) => {
        (req.body["sizePack"] = result["packSize"]), updatePack(req, result);
        let ProductItem = req.tenancy.getModelByTenant(
          req.dbUse,
          "productitems",
          productItemsSchema
        );

        ProductItem.find({ productId: result._id })
          .exec()
          .then((data) => {
            if (data.length) {
              let idi = data[0]["_id"];
              req.body["productId"] = result._id;
              delete req.body["_id"];
              ProductItem.findOneAndUpdate(
                { _id: idi },
                { $set: req.body },
                { new: true }
              )
                .exec()
                .then((success) => {
                  req.io.sockets.emit(`${req.query.db}productItem`, success);
                  req.io.sockets.emit(`${req.query.db}productUpdate`, result);
                  res.status(200).json({
                    message: "produit mise a jour",
                    result: result,
                    productItem: success,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              ProductItem.find({
                //  productId: supId,
                storeId: result.storeId,
                desabled: false,
                // maeriId: result.maeriId,
                adminId: result.adminId,
                name: result.name,
              })
                .exec()
                .then((data) => {
                  // console.log(data);
                  let id = data[0]["_id"];
                  req.body["productId"] = result._id;

                  delete req.body["_id"];

                  ProductItem.findOneAndUpdate(
                    { _id: id },
                    { $set: req.body },
                    { new: true }
                  )
                    .exec()
                    .then((success) => {
                      let productItemId = success["_id"];
                      let Packs = req.tenancy.getModelByTenant(
                        req.dbUse,
                        "packs",
                        Pack
                      );
                      let obj = success;
                      obj["productItemId"] = productItemId;
                      Packs.find({ productId: result._id })
                        .exec()
                        .then((data) => {
                          if (data.length) {
                            let id = data[0]["_id"];

                            Packs.findOneAndUpdate(
                              { _id: id },
                              {
                                $set: {
                                  productItemId: productItemId,
                                  sizePack: success["packSize"],
                                },
                              },
                              { new: true }
                            );
                          }
                        });
                      req.io.sockets.emit(
                        `${req.params.adminId}productItem`,
                        success
                      );
                      res.status(200).json({
                        message: "produit mise a jour",
                        result: result,
                        child: success,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
            }
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
);

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  //console.log(req.body);

  //OnePack
  console.log(req.body);
  console.log("hello pack update");
  req.tenant
    .findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            message: "ajouté ",
            resultat: success,
            // professeur: prof
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

router.patch("/image/db", upload1.single("image"), async (req, res, next) => {
  /* await resizer(
    // path.join(UPLOAD_PATH, req.file.filename),
    "/home/ubuntu/elpis/server/uploads/" + req.file.filename,
    require("../../utils/imageSetUp")
  );*/
  const id = req.body._id;
  (req.body["filename"] = req.file.filename),
    (req.body["originalName"] = req.file.originalname);
  let url =
    req.protocol +
    "://" +
    req.get("host") +
    "/products/" +
    id +
    "?db=" +
    req.query.db;
  res.status(201).json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    url: url,
  });
});

updatePack = (req, result) => {
  let Packs = req.tenancy.getModelByTenant(req.dbUse, "packs", Pack);
  let packItem = req.tenancy.getModelByTenant(
    req.dbUse,
    "packitems",
    PackitemsSchema
  );
  Packs.find({ productId: result._id })
    .exec()
    .then((data) => {
      if (data.length) {
        let id = data[0]["_id"];
        req.body["productId"] = result._id;
        delete req.body["_id"];
        Packs.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
          .exec()
          .then((success) => {
            console.log(success);
            packItem
              .find({ productId: result._id })
              .exec()
              .then((data) => {
                if (data.length) {
                  let id = data[0]["_id"];
                  req.body["productId"] = result._id;
                  packItem
                    .findOneAndUpdate(
                      { _id: id },
                      { $set: req.body },
                      { new: true }
                    )
                    .exec()
                    .then((packsitems) => {});
                } else {
                  packItem
                    .find({
                      storeId: result.storeId,
                      desabled: false,
                      maeriId: result.maeriId,
                      adminId: result.adminId,
                    })
                    .exec()
                    .then((data) => {
                      if (data && data.length) {
                        let id = data[0]["_id"];
                        req.body["productId"] = result._id;
                        delete req.body["_id"];
                        packItem
                          .findOneAndUpdate(
                            { _id: id },
                            { $set: req.body },
                            { new: true }
                          )
                          .exec()
                          .then((packsitems) => {})
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    });
                }
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Packs.find({
          storeId: result.storeId,
          desabled: false,
          maeriId: result.maeriId,
          adminId: result.adminId,
        })
          .exec()
          .then((data) => {
            let id = data[0]["_id"];
            req.body["productId"] = result._id;
            delete req.body["_id"];
            Packs.findOneAndUpdate(
              { _id: id },
              { $set: req.body },
              { new: true }
            )
              .exec()
              .then((pack) => {})
              .catch((err) => {
                console.log(err);
              });
          });
      }
    });
};

module.exports = router;
