const mongoose = require("mongoose");
const Fifo = require("../api/models/Fifo");
const tenant = require("../getTenant");

const decrementFifoStock = async (quantity, adminId, productId) => {
  // let doc = await ProductList.findById({ _id: stock.productId });

  // req.io.sockets.emit(`${req.query.db}productlist`, result);
  try {
    let result = await Fifo.find({
      adminId: adminId,
      actif: true,
      productId: productId,
    });
    let doc = result[0];

    let resu = await Fifo.findOneAndUpdate(
      { _id: doc._id },
      { $set: { quantity: doc.quantity - quantity } },
      { new: true }
    );
    console.log("here is fifo====>", resu);
  } catch (error) {}
};

module.exports.decrementFifoStock = decrementFifoStock;
