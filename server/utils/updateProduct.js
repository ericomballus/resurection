const productItemsSchema = require("../api/models/ProductItem");
const Pack = require("../api/models/ProductPack");
module.exports = (req, res, product, next) => {
  return new Promise(async (resolve, reject) => {
    resolve(true);
    try {
      let ProductItem = req.tenancy.getModelByTenant(
        req.dbUse,
        "productitems",
        productItemsSchema
      );

      let productitem = await ProductItem.find({ productId: product._id });
      let idi = productitem[0]["_id"];
      //  req.body["productId"] = product._id;

      req.body["url"] =
        req.protocol +
        "://" +
        req.get("host") +
        "/products/" +
        product._id +
        "?db=" +
        req.query.db;
      delete req.body["_id"];
      product._id == "-------hello";

      console.log("========================****************");
      console.log(req.body);
      console.log("========================");
      let result = await ProductItem.findOneAndUpdate(
        { _id: idi },
        { $set: req.body },
        { new: true }
      );
      let resultat = {
        productId: result.productId,
        adminId: result.adminId,
        purchasingPrice: result.purchasingPrice,
        sellingPrice: result.sellingPrice,
        name: result.name,
        url: result.url,
        unitNameProduct: result.unitNameProduct,
        sizeUnitProduct: result.sizeUnitProduct,
        maeriId: result.maeriId,
        produceBy: result.produceBy,
        ristourne: result.ristourne,
        packSize: result.packSize,
        packPrice: result.packPrice,
        sizePack: result.packSize,
        categoryName: result.categoryName,
        superCategory: result.superCategory,
        storeId: result.storeId,
        resourceList: result.resourceList,
        productItemId: result._id,
        unitNamePack: product.unitName,
      };
      //let obj = result;
      let Packs = req.tenancy.getModelByTenant(req.dbUse, "packs", Pack);
      let pack = await Packs.find({ productId: resultat.productId });
      let idPack = pack[0]["_id"];
      Packs.findOneAndUpdate(
        { _id: idPack },
        {
          $set: resultat,
        },
        { new: true }
      );
      resolve("ok");
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
};
