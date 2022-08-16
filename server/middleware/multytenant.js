const subleaseMiddleware = require("mongoose-sublease/express");
const mongoose = require("mongoose");
const Product = require("../api/models/Product");
const Category = require("../api/models/Category");
const SuperSchema = require("../api/models/Category-sup");
const Pack = require("../api/models/ProductPack");
const Packitems = require("../api/models/ProductPackItem");
const Product_manufactured = require("../api/models/Product-manufactured");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const Invoice = require("../api/models/invoice");
const productItem = require("../api/models/ProductPackItem");
const transactionItem = require("../api/models/Transaction");
const cashOpen = require("../api/models/Cash-opening");
const Resource = require("../api/models/Resource");
//const ResourceItem = require("../api/models/Resource_item");
const Company = require("../api/models/Company_Setting");
const Purchase = require("../api/models/Purchase");
const Billard = require("../api/models/Billard");
//const Custumer = require("../api/models/Custumer");

//lauch custumer database
let db = async (req, res, next) => {
  let dbname = req.query.db;
  if (mongoose.connection.readyState === 0) {
    console.log(`status de la db ===========> ${0}`);
    await mongoose.connect(
      `mongodb://localhost:27017/${dbname}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`connect to ${dbname} database`);
          req.checkServer = console.log(mongoose.connection.readyState);
        }
      }
    );
    next();
  }

  if (mongoose.connection.readyState === 1) {
    console.log(`${req.query.db} is connected ===========> ${1}`);
    next();
  }
  /*
  if (mongoose.connection.readyState === 2) {
    console.log(`${req.query.db} try connecting   =============> status ${2}`);

    setTimeout(() => {
      mongoose.connect(
        `mongodb://localhost:27017/${req.query.db}`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("serveur is open now...!!!!");

            next();
          }
        }
      );
    }, 150);
  } */
  /*
  if (mongoose.connection.readyState === 3) {
    console.log(3);
    console.log(`${req.query.db} disconnecting =========> status ${2}`);

    setTimeout(() => {
      mongoose.connect(
        `mongodb://localhost:27017/${req.query.db}`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("serveur is open now...!!!!");

            next();
          }
        }
      );
    }, 150);
  } */

  // const cart = req.body.cart
};

module.exports.db = db;
module.exports.tenant = subleaseMiddleware(mongoose.connection, {
  Product: Product,
});

module.exports.tenantProductItem = subleaseMiddleware(mongoose.connection, {
  productItem: productItem,
});

module.exports.tenantcat = subleaseMiddleware(mongoose.connection, {
  Category: Category,
});

module.exports.masupcat = subleaseMiddleware(mongoose.connection, {
  SuperCategory: SuperSchema,
});

module.exports.tenantpack = subleaseMiddleware(mongoose.connection, {
  Pack: Pack,
});

module.exports.tenantpackitems = subleaseMiddleware(mongoose.connection, {
  Packitems: Packitems,
});

module.exports.tenantManufactured = subleaseMiddleware(mongoose.connection, {
  Product_manufactured: Product_manufactured,
});

module.exports.tenantManufacturedItem = subleaseMiddleware(
  mongoose.connection,
  {
    Manufactureitem: Manufactureitem,
  }
);

module.exports.tenantInvoice = subleaseMiddleware(mongoose.connection, {
  Invoice: Invoice,
});

module.exports.tenanTransaction = subleaseMiddleware(mongoose.connection, {
  transactionItem: transactionItem,
});

module.exports.tenantcashopening = subleaseMiddleware(mongoose.connection, {
  cashOpen: cashOpen,
});
module.exports.tenantCompany = subleaseMiddleware(mongoose.connection, {
  Company: Company,
});

module.exports.tenantPurchase = subleaseMiddleware(mongoose.connection, {
  Purchase: Purchase,
});

module.exports.tenantBillard = subleaseMiddleware(mongoose.connection, {
  Billard: Billard,
});
