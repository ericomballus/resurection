const mongoose = require("mongoose");
const cashOpenSchema = require("../api/models/Cash-opening");
const ExpenseSchema = require("../api/models/Expenses");

module.exports = async (req, res, next) => {
  try {
    if (req.method == "DELETE") {
      let doc = await findExpense(req);
      if (doc) {
        console.log("expense doc document ===>", doc);
      }
      let openCash = await OpenCashExist(req, doc.openCashDateId);
      if (openCash) {
        console.log("open cash date ===>", openCash);
        if (doc) {
          if (openCash.expense) {
            openCash.expense = openCash.expense - doc.amount;
          } else if (openCash.expense < 0) {
            openCash.expense = openCash.expense - doc.amount;
          } else {
            openCash.expense = 0 - doc.amount;
          }

          await UpdateOpenCash(openCash, req);
        }
      }
      next();
    } else if (req.method == "POST") {
      let openCash = await OpenCash(req);
      console.log(openCash);
      if (openCash) {
        if (openCash.recipe < req.body.amount) {
          res.status(500).json({
            message: `le montant dans la caisse est de: ${openCash.recipe} il est inférieure a la depense`,
          });
        } else {
          req.body.openCashDateId = openCash._id;
          if (openCash.expense) {
            openCash.expense = openCash.expense + req.body.amount;
          } else if (openCash.expense < 0) {
            openCash.expense = openCash.expense - req.body.amount;
          } else {
            openCash.expense = req.body.amount;
          }

          await UpdateOpenCash(openCash, req);
          next();
        }
      } else {
        res.status(500).json({
          message: "la caisse n'est pas ouverte",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

async function findExpense(req) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let Expense = mongoose.model("expenses", ExpenseSchema);
    /* await req.tenancy.getModelByTenant(
      db,
      "expenses",
      ExpenseSchema
    );*/

    Expense.find({ _id: req.body._id })
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

async function OpenCash(req) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("cashopens", cashOpenSchema);
    //await req.tenancy.getModelByTenant(db, "cashopens", cashOpenSchema);

    const tenant = a;
    tenant
      .find({
        adminId: req.query.db,
        open: true,
        storeId: req.body.storeId,
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

async function OpenCashExist(req, openCashDateId) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("cashopens", cashOpenSchema);

    const tenant = a;
    tenant
      .find({
        _id: openCashDateId,
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
async function UpdateOpenCash(doc, req) {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("cashopens", cashOpenSchema);

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
