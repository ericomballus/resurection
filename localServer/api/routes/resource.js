const express = require("express");
const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const ResourceItem = require("../models/Resource_item");
const router = express.Router();

router.post("/:adminId", async (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();

  let theDate = `${year}-${month}-${day}`;
  req.body["adminId"] = req.params.adminId;
  const resource = await req.tenant.create(req.body);
  /* .then((resource) => {
      
    });*/
  //console.log(resource);
  let db = req.dbUse;
  let a = await req.tenancy.getModelByTenant(db, "Resourceitem", ResourceItem);
  const tenant2 = a;
  let resourceitem = await tenant2.create({
    name: req.body.name,
    adminId: req.params.adminId,
    unitName: req.body.unitName,
    packSize: req.body.packSize,
    sizeUnit: req.body.sizeUnit,
    resourceId: resource._id,
    storeId: req.body.storeId,
    purchasingPrice: resource.purchasingPrice,
    page: resource.page,
  });
  console.log(resourceitem);
  req.io.sockets.emit(`${req.params.adminId}newResource`, resource);
  res
    .status(201)
    .json({ message: "ok ok product", data: resource, item: resourceitem });
});

//take all products
router.get("/resource/:adminId", (req, res, next) => {
  req.tenant
    .find({ adminId: req.params.adminId, desabled: false }, "-__v")
    .lean()
    .exec((err, dataR) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      res.json({
        resources: dataR,
      });
    });
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
});

router.delete(
  "/:id/:adminId",

  async (req, res, next) => {
    let catId = req.params.id;
    let adminId = req.params.adminId;
    //Category
    try {
      let result = await req.tenant
        .findOneAndUpdate(
          { _id: catId },
          {
            $set: {
              desabled: true,
            },
          },
          { new: true }
        )
        .exec();
      let a = await req.tenancy.getModelByTenant(
        req.dbUse,
        "resourceitem",
        ResourceItem
      );
      const tenant = a;
      result2 = await tenant
        .findOneAndUpdate(
          { resourceId: catId },
          {
            $set: {
              desabled: true,
            },
          },
          { new: true }
        )
        .exec();
      res.status(200).json({
        message: "category Deleted",
        resource: result,
        resourceItem: result2,
      });
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
);

module.exports = router;

/*
 let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );
  const tenant = a;
  tenant
*/
