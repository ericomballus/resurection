const manufacturedItemSchema = require("../api/models/Product-manufactured-item");
const mongoose = require("mongoose");

module.exports = (req, res, body, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productId = body["_id"];
      let obj = {
        adminId: req.params.adminId,
        name: req.body.name,
        sellingPrice: body.sellingPrice,
        description: body.description,
        categoryId: body.categoryId,
        resourceList: body.resourceList,
        categoryName: body.categoryName,
        produceBy: body.produceBy,
        maeriId: body.maeriId,
        url: body.url,
        source: body.source,
        superCategory: body.superCategory,
        storeId: body.storeId,
        size: body.size,
        purchasingPrice: body.purchasingPrice,
        productId: productId,
      };

      let manufacturedItem = mongoose.model(
        "manufactureditemSchema",
        manufacturedItemSchema
      );
      /* req.tenancy.getModelByTenant(
        req.dbUse,
        "manufactureditemSchema",
        manufacturedItemSchema
      );*/

      let prod = await manufacturedItem.create(obj);
      resolve(prod);
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
};
