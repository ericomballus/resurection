const productItemsSchema = require("../api/models/ProductItem");
const Pack = require("../api/models/ProductPack");
module.exports = (req, res, body, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productId = body["productId"];
      let obj = {
        productId: body.productId,
        adminId: body.adminId,
        purchasingPrice: body.purchasingPrice,
        sellingPrice: body.sellingPrice,
        name: body.name,
        url: body.url,
        unitNameProduct: body.unitNameProduct,
        sizeUnitProduct: body.sizeUnitProduct,
        maeriId: body.maeriId,
        produceBy: body.produceBy ? body.produceBy : "",
        ristourne: body.ristourne,
        packSize: body.packSize,
        packPrice: body.packPrice,
        categoryName: body.categoryName,
        superCategory: body.superCategory,
        storeId: body.storeId,
        resourceList: body.resourceList,
      };

      if (body["sizeUnit"]) {
        body["sizeUnitProduct"] = body["sizeUnit"];
      }
      if (body["unitName"]) {
        body["unitNameProduct"] = body["unitName"];
      }
      let ProductItem = req.tenancy.getModelByTenant(
        req.dbUse,
        "productitems",
        productItemsSchema
      );

      let prod = await ProductItem.create(obj);

      // let resultat = Object.unfreeze(prod);
      let resultat = {
        productId: prod.productId,
        adminId: prod.adminId,
        purchasingPrice: prod.purchasingPrice,
        sellingPrice: prod.sellingPrice,
        name: prod.name,
        url: prod.url,
        unitNameProduct: prod.unitNameProduct,
        sizeUnitProduct: prod.sizeUnitProduct,
        maeriId: prod.maeriId,
        produceBy: prod.produceBy,
        ristourne: prod.ristourne,
        packSize: prod.packSize,
        packPrice: prod.packPrice,
        sizePack: prod.packSize,
        categoryName: prod.categoryName,
        superCategory: prod.superCategory,
        storeId: prod.storeId,
        resourceList: prod.resourceList,
        productItemId: prod._id,
        unitNamePack: body.unitName,
      };
      let pack = resultat;
      let Packs = req.tenancy.getModelByTenant(req.dbUse, "packs", Pack);

      let packResult = await Packs.create(pack);
      resolve("ok");
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
};
