const mongoose = require("mongoose");
const cashOpenSchema = require("../api/models/Cash-opening");

module.exports = async (bill, req) => {
  try {
    let openCash = await OpenCashDate(req, bill);
    if (openCash) {
      if (openCash.recipe) {
        if (bill.cancel) {
          openCash.recipe = openCash.recipe - bill.montant;
        } else {
          openCash.recipe = openCash.recipe + bill.montant;
        }
      } else if (openCash.expense < 0) {
        // openCash.expense = openCash.expense - req.body.montant;
      } else {
        if (bill.cancel) {
        } else {
          openCash.recipe = bill.montant;
        }
      }
      await UpdateOpenCashDate(openCash, req);
    }
  } catch (error) {
    console.log(error);
  }
};

async function OpenCashDate(req, bill) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("cashopens", cashOpenSchema);
    // await req.tenancy.getModelByTenant(db, "cashopens", cashOpenSchema);

    const tenant = a;
    tenant
      .find({
        adminId: req.query.db,
        storeId: bill.storeId,
        _id: bill.openCashDateId,
      })
      .lean()
      .exec()
      .then((docs) => {
        resolve(docs[0]);
      })
      .catch((err) => {
        resolve(null);
      });
  });
}

async function UpdateOpenCashDate(doc, req) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("cashopens", cashOpenSchema);
    //req.tenancy.getModelByTenant(db, "cashopens", cashOpenSchema);

    const tenant = a;
    tenant
      .findOneAndUpdate(
        { _id: doc._id },
        { $set: doc },
        { new: true },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            resolve(success);
          }
        }
      )
      .catch((err) => {
        reject(err);
      });
  });
}
