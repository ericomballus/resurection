const mongoose = require("mongoose");
const productListSchema = require("../api/models/Product-List");
const tenant = require("../getTenant");

const updateUseStock = async (stock, req) => {
  return new Promise(async (resolve, reject) => {
    let ProductList = mongoose.model("productlist", productListSchema);
    try {
      // let doc = await ProductList.findById({ _id: stock.productId });
      let result = await ProductList.findOneAndUpdate(
        { _id: stock.productId },
        {
          $set: {
            quantityItems: stock.quantity,
            quantityStore: 0,
          },
        },
        { new: true }
      );
      req.io.sockets.emit(`${req.query.db}FifoProductlist`, result);
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const desableUseStock = async (stock, req) => {
  return new Promise(async (resolve, reject) => {
    let ProductList = mongoose.model("productlist", productListSchema);
    try {
      // let doc = await ProductList.findById({ _id: stock.productId });
      let result = await ProductList.findOneAndUpdate(
        { _id: stock.productId },
        {
          $set: {
            quantityItems: 0,
            quantityStore: 0,
          },
        },
        { new: true }
      );
      req.io.sockets.emit(`${req.query.db}FifoProductlist`, result);
      req.io.sockets.emit(`${req.query.db}productlist`, result);
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports.updateUseStock = updateUseStock;
module.exports.desableUseStock = desableUseStock;
