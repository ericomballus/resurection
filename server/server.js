const Module = require("module");
//module load vladimir
/*const load = Module._load;
Module._load = function (request, parent) {
  console.log(parent.id, "===>", request);
  return load.apply(this, arguments);
};*/
const imageDownloader = require("node-image-downloader");
const express = require("express");
//console.log(express);
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Admin = mongoose.mongo.Admin;
var token;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userRoutes = require("./api/routes/users");
const contratRoutes = require("./api/routes/contrat");
const imagesRoutes = require("./api/routes/images");
const vendorRoutes = require("./api/routes/vendors");
const retailerOrderRoutes = require("./api/routes/retailersOrders");
const proposalOrderRoutes = require("./api/routes/vendorProposalOrders");
const productRoutes = require("./api/routes/products");
const maeri_productRoutes = require("./api/routes/maeri_products");
const maeri_categoryRoutes = require("./api/routes/maeri_categorie");
const productitemsRoutes = require("./api/routes/productitem");
const packRoutes = require("./api/routes/productpack");
const packitemsRoutes = require("./api/routes/productpackitem");
const invoiceRoutes = require("./api/routes/invoices");
const billRoutes = require("./api/routes/bills");
const inventoryRoutes = require("./api/routes/inventorys");
const admininventoryRoutes = require("./api/routes/admin_inventorys");
const categoryRoutes = require("./api/routes/category");
const categorysupRoutes = require("./api/routes/category-sup");
const madeRoutes = require("./api/routes/maeri_madeby");
const roleRoutes = require("./api/routes/role");
const transactionRoutes = require("./api/routes/transaction");
const Product_manufacturedRoutes = require("./api/routes/product_manufactured");
const Product_items_manufacturedRoutes = require("./api/routes/product-manufactured-item");
const cashOpenRoutes = require("./api/routes/cash-opening");
const resourceRoutes = require("./api/routes/resource");
const resourceItemRoutes = require("./api/routes/resources_items");
const cartRoutes = require("./api/routes/paniers");
const companyRoutes = require("./api/routes/company");
const purchaseRoutes = require("./api/routes/purchase");
const custumerRoutes = require("./api/routes/custumer");
const balanceRoutes = require("./api/routes/customer_balance");
const billardRoutes = require("./api/routes/billard");
const productListRoutes = require("./api/routes/products-list");
const usersRoutes = require("./api/routes/users");
const employeRoutes = require("./api/routes/employes");
const maeriProductRoutes = require("./api/routes/maeri_products");
const backgroundLogoRoutes = require("./api/routes/customers_background");
const consignetRoutes = require("./api/routes/consigne");
//taxi maeri app import route
const DriverTaxiRoutes = require("./api/routes/taxidriver");
const PassengerTransactionRoutes = require("./api/routes/passenger_transaction");
const MaeriTaxiPassengerRoutes = require("./api/routes/maeri_taxi_passenger");
const custTomerTaxiRoutes = require("./api/routes/customer_taxi");
const cashTaxiRoutes = require("./api/routes/taxi-cash-opening");
const taxiImagePubRoutes = require("./api/routes/taxi_image_pub");
const managerInventoryRoutes = require("./api/routes/manager_inventory");
const gammeRoutes = require("./api/routes/gamme");
const purchaseOrderRoutes = require("./api/routes/purchase_order");
const childBillRoutes = require("./api/routes/child_bill");
const refuelingRoutes = require("./api/routes/refueling");
const fichePointageRoutes = require("./api/routes/fiche_pointage");
const observerRoutes = require("./api/routes/observer");
const expansesRoutes = require("./api/routes/expenses");
const expansesTypesRoutes = require("./api/routes/expenses-types");
const productTransactionRoutes = require("./api/routes/productionTransactions");
//const printerRoutes = require("./api/routes/printe-invoice");
const patientRoutes = require("./api/routes/patient");
const parameterRoutes = require("./api/routes/parameters");
const ordonnanceRoutes = require("./api/routes/ordonnace");
const hospitalisationRoutes = require("./api/routes/hospitalisation");
const fifoRoutes = require("./api/routes/fifo");

// import schema
const billardSchema = require("./api/models/Billard");
const cashOpeningSchema = require("./api/models/Cash-opening");
const categorySupSchema = require("./api/models/Category-sup");
const categorySchema = require("./api/models/Category");
const productSchema = require("./api/models/Product");
const productItemsSchema = require("./api/models/ProductItem");
const invoiceSchema = require("./api/models/invoice");
const billSchema = require("./api/models/Bill");
const productListSchema = require("./api/models/Product-List");
const companySettingSchema = require("./api/models/Company_Setting");
const custumerSchema = require("./api/models/Custumer");
//const employeSchema = require("./api/models/Employe");
const purshaseSchema = require("./api/models/Purchase");
const resourceSchema = require("./api/models/Resource");
const resourceitemSchema = require("./api/models/Resource_item");
const transactionSchema = require("./api/models/Transaction");
const packitemsSchema = require("./api/models/ProductPackItem");
const manufactureduserschemas = require("./api/models/Product-manufactured");
const manufactureditemuserschemas = require("./api/models/Product-manufactured-item");
const packSchema = require("./api/models/ProductPack");
const inventorySchema = require("./api/models/Inventory");
const admininventorySchema = require("./api/models/admin_Iventory");
const managerinventorySchema = require("./api/models/manager_Inventory");
const backgroundImageSchema = require("./api/models/Custumer_Background");
const consigneSchema = require("./api/models/Consignes");
const gammeSchema = require("./api/models/Gamme");
const PurchaseOrderSchema = require("./api/models/Purchase_Order");
const ChildBillSchema = require("./api/models/Child_Bill");
const RefuelingSchema = require("./api/models/Refueling");
const FichePointageSchema = require("./api/models/Fiche_Pointage");
const ObserverSchema = require("./api/models/Observer");
const ExpenseSchema = require("./api/models/Expenses");
const ExpenseTypeSchema = require("./api/models/Expenses-types");

const tenant = "";
const userHandler = require("./utils/userConnection");
const offlineHandler = require("./utils/offlineManager");

//const { AsyncLocalStorage } = require("async_hooks");
const { static } = require("express");
//const asyncLocalStorage = new AsyncLocalStorage();
/*
const requestIdMiddleware = (req, res, next) => {
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("requestId", req.url);

    next();
  });
}; */

const db = "maeri";
var path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
let ObjectId = require("mongoose").Types.ObjectId;

/*
var myWriteStream = fs.createWriteStream(
  path.join(__dirname, "serverLog.txt"),
  {
    flags: "a",
  }
);*/

const port = process.env.PORT || 3000;
let io = require("socket.io").listen(
  app.listen(port, () => {
    try {
      const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      };
      // let uri = "mongodb://foo:bar@localhost/admin?authSource=admin";
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
      mongoose.connect(uri, options, (err) => {
        if (err) {
          console.log(err);
          // process.exit(1);
        } else {
          console.log(
            "connected to MongoDB Port",
            port,
            "and plateForm",
            process.platform
          );
          console.log("path found here", __dirname);
        }
      });
      mongoose.connection.on("error", (err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  })
);

app.set("view engine", "ejs");
app.use(morgan("dev"));

app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);

io.sockets.on("connection", (socket) => {
  console.log("client connect");
  io.sockets.emit("connect");
  socket.emit("mballus", 1111);
  socket.on("echo", function (data) {
    io.sockets.emit("message", data);
  });
  socket.on("isConnect", function (socket) {
    console.log("je suis connecté dispo");
  });
  socket.on("login", function (data) {
    console.log(data);
  });
  socket.on("disconnect", function (data) {});
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(function (req, res, next) {
  let oldSend = res.send;
  res.send = function (data) {
    oldSend.apply(res, arguments);
  };
  next();
});
app.use(userHandler);
app.use(offlineHandler);

app.use("/uploads", express.static("uploads/lena"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization'
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET,OPTIONS"
    );
  }
  next();
});

//Routes which should handle requests
app.use("/database", (req, res, next) => {
  let uri =
    process.env.MONGODB_URI ||
    "mongodb://foo:bar@localhost/admin?authSource=admin";
  var adminId = req.query.adminId;
  var connection = mongoose.createConnection(uri);
  connection.on("open", function () {
    // connection established
    connection.db;
    new Admin(connection.db).listDatabases((err, result) => {
      var allDatabases = result.databases;

      if (err) {
        console.log(err);
      } else {
        res.status(200).json(allDatabases);
      }
      connection.close();
    });
  });

  //  next();
});
app.use("/databaseCollections", (req, res, next) => {
  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/",
    (err, db) => {
      if (err) {
        console.log(err);
      } else {
        // let dbo = db.db(`${req.query.dbName}`).collection("erico");
        let dbo = db.db(`${req.query.dbName}`);
        dbo.listCollections().toArray((err, collectionsInfos) => {
          console.log(collectionsInfos);
          if (err) {
            console.log(err);
          } else {
            res.status(200).json(collectionsInfos);
          }
          // dbo.close();
        });
      }
    }
  );
});

app.use("/databaseCollectionsGetDocs", (req, res, next) => {
  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/",
    (err, db) => {
      if (err) {
        console.log(err);
      } else {
        let dbo = db.db(`${req.query.dbName}`);
        // let dbo = db.db(`${req.query.dbName}`).collection('erico').deleteMany();
        dbo
          .collection(`${req.query.collectionName}`)
          .find()
          .toArray((err, docs) => {
            console.log(docs);
            if (err) {
              console.log(err);
            } else {
              res.status(200).json(docs);
            }
            // dbo.close();
          });
      }
    }
  );
});

app.use("/databaseCollectionsDeleteDocs", (req, res, next) => {
  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/",
    async (err, db) => {
      if (err) {
        // console.log(err);
      } else {
        if (req.query.collectionName == "productlists") {
          let tab = [];
          let dbo = db.db(`${req.query.dbName}`);
          dbo
            .collection(`${req.query.collectionName}`)
            .find({ storeId: req.body.storeId })
            .toArray((err, docs) => {
              docs.forEach((doc) => {
                console.log(doc);
                dbo
                  .collection(`${req.query.collectionName}`)
                  .findOneAndUpdate(
                    { _id: doc._id },

                    {
                      $set: {
                        quantityItems: 0,
                        quantityStore: 0,
                        bottle_full: 0,
                        bottle_empty: 0,
                        bottle_total: 0,
                        tabitem: [],
                      },
                    },
                    { new: true, upsert: true, returnOriginal: false }
                  )
                  .then((result) => {
                    tab.push(result);
                  });
              });
              res.status(200).json(tab);
            });
        } else if (
          req.query.collectionName == "billards" ||
          //req.query.collectionName == "productlists" ||
          req.query.collectionName == "productitems"
        ) {
          let tab = [];
          let dbo = db.db(`${req.query.dbName}`);
          dbo
            .collection(`${req.query.collectionName}`)
            .find({ storeId: req.body.storeId })
            .toArray((err, docs) => {
              docs.forEach((doc) => {
                console.log(doc);
                dbo
                  .collection(`${req.query.collectionName}`)
                  .findOneAndUpdate(
                    { _id: doc._id },

                    {
                      $set: {
                        quantityItems: 0,
                        quantityStore: 0,
                        tabitem: [],
                      },
                    },
                    { new: true, upsert: true, returnOriginal: false }
                  )
                  .then((result) => {
                    tab.push(result);
                  });
              });
              res.status(200).json(tab);
            });
        } else {
          try {
            let dbo = db.db(`${req.query.dbName}`);
            let result = await dbo
              .collection(`${req.query.collectionName}`)
              .deleteMany({
                $or: [
                  { adminId: req.body.adminId },
                  { adminId: new ObjectId(req.body.adminId) },
                  // { cancel: { $exists: false } },
                ],
              });
            // .deleteMany({ adminId: req.body.adminId });
            if (result.result.n == 0) {
              let result2 = await dbo
                .collection(`${req.query.collectionName}`)
                .deleteMany({ storeId: req.body.storeId });
              res.status(200).json(result2);
            } else {
              res.status(200).json(result);
            }
          } catch (e) {
            console.error(e);
            res.status(500).json(e);
          } finally {
          }
        }
      }
    }
  );
});
app.use("/employe", employeRoutes);
app.use("/images", imagesRoutes);
//app.use("/printinvoice", printerRoutes);
app.use("/production_transaction", productTransactionRoutes);
app.use("/Role", roleRoutes);
app.use("/maeriproducts", maeriProductRoutes);
app.use("/madeby", madeRoutes);
app.use("/custumer", custumerRoutes);
ordonnanceRoutes;
app.use("/balance", balanceRoutes);
//app.use("/maeriproducts", maeri_productRoutes);
app.use("/maericategorie", maeri_categoryRoutes);
//app.use("/users", userRoutes);
app.use("/users", userRoutes);
app.use("/contrat", contratRoutes);
app.use("/vendor", vendorRoutes);
// hospital routes

app.use("/patient", patientRoutes);
app.use("/parameter", parameterRoutes);
app.use("/ordonnance", ordonnanceRoutes);
app.use("/hospitalisation", hospitalisationRoutes);
app.use("/fifo", fifoRoutes);
app.use(
  "/managerinventory",
  async (req, res, next) => {
    let a = mongoose.model("managerinventorie", managerinventorySchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  managerInventoryRoutes
);
app.use(
  "/retailerOrder",
  async (req, res, next) => {
    let a = mongoose.model("productitems", productItemsSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  retailerOrderRoutes
);

app.use("/employe", employeRoutes);
app.use("/taxi", DriverTaxiRoutes);
app.use("/passengertransaction", PassengerTransactionRoutes);
app.use("/maeritaxipassenger", MaeriTaxiPassengerRoutes);
app.use(
  "/products",
  async (req, res, next) => {
    let a = mongoose.model("products", productSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  productRoutes
);
// custumer routes

app.use(
  "/products_resto",
  async (req, res, next) => {
    let a = mongoose.model("manufacturedUserSchema", manufactureduserschemas);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  Product_manufacturedRoutes
);
app.use(
  "/products_resto_item",
  async (req, res, next) => {
    let a = mongoose.model(
      "manufactureditemSchema",
      manufactureditemuserschemas
    );
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  Product_items_manufacturedRoutes
);
app.use(
  "/pack",
  async (req, res, next) => {
    let a = mongoose.model("packs", packSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },

  packRoutes
);
app.use(
  "/productsitem",
  async (req, res, next) => {
    let a = mongoose.model("productitems", productItemsSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  productitemsRoutes
);
app.use(
  "/packitems",
  async (req, res, next) => {
    let a = mongoose.model("packitems", packitemsSchema);
    req.tenant = a;
    next();
  },
  packitemsRoutes
);

app.use("/cart", cartRoutes);
app.use(
  "/invoice",
  async (req, res, next) => {
    let a = mongoose.model("invoice", invoiceSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  invoiceRoutes
);
app.use(
  "/bill",
  async (req, res, next) => {
    let a = mongoose.model("bill", billSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  billRoutes
);
app.use(
  "/inventory",
  async (req, res, next) => {
    let a = mongoose.model("inventory", inventorySchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  inventoryRoutes
);
app.use(
  "/admininventory",
  async (req, res, next) => {
    let a = mongoose.model("admininventory", admininventorySchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  admininventoryRoutes
);
app.use(
  "/category",
  async (req, res, next) => {
    let a = mongoose.model("categorie", categorySchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  categoryRoutes
);
app.use(
  "/supcategory",
  async (req, res, next) => {
    let a = mongoose.model("supercategorie", categorySupSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  categorysupRoutes
);
app.use(
  "/transaction",
  async (req, res, next) => {
    let a = mongoose.model("transaction", transactionSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  transactionRoutes
);
app.use(
  "/cashOpen",
  async (req, res, next) => {
    let a = mongoose.model("cashopens", cashOpeningSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  cashOpenRoutes
);
app.use(
  "/resource",
  async (req, res, next) => {
    let a = mongoose.model("resource", resourceSchema);
    req.tenant = a;
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  resourceRoutes
);
app.use(
  "/resourceitem",
  async (req, res, next) => {
    let a = mongoose.model("resourceitem", resourceitemSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  resourceItemRoutes
);
app.use(
  "/company",
  async (req, res, next) => {
    let a = mongoose.model("company", companySettingSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  companyRoutes
);
app.use(
  "/purchase",
  async (req, res, next) => {
    let a = mongoose.model("purchase", purshaseSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  purchaseRoutes
);
app.use(
  "/billard",
  async (req, res, next) => {
    let a = mongoose.model("billard", billardSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  billardRoutes
);
app.use(
  "/productlist",
  async (req, res, next) => {
    let a = mongoose.model("productlist", productListSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  productListRoutes
);

app.use(
  "/gamme",
  async (req, res, next) => {
    let a = mongoose.model("gamme", gammeSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  gammeRoutes
);

app.use(
  "/purchaseorder",
  async (req, res, next) => {
    let a = mongoose.model("purchaseOrder", PurchaseOrderSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  purchaseOrderRoutes
);

app.use(
  "/childbill",
  async (req, res, next) => {
    let a = mongoose.model("childBill", ChildBillSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  childBillRoutes
);

app.use(
  "/refueling",
  async (req, res, next) => {
    let a = mongoose.model("refueling", RefuelingSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  refuelingRoutes
);

app.use(
  "/expenses",
  async (req, res, next) => {
    let a = mongoose.model("expenses", ExpenseSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  expansesRoutes
);

app.use(
  "/expenses_type",
  async (req, res, next) => {
    let a = mongoose.model("expensesTypes", ExpenseTypeSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  expansesTypesRoutes
);

app.use(
  "/consigne",
  async (req, res, next) => {
    let a = mongoose.model("consigne", consigneSchema);
    req.tenant = a;
    next();
  },
  consignetRoutes
);

app.use(
  "/custumerlogo",
  async (req, res, next) => {
    let a = mongoose.model("logoimage", backgroundImageSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },
  backgroundLogoRoutes
);

app.use(
  "/observer",
  async (req, res, next) => {
    let a = mongoose.model("observer", ObserverSchema);
    req.tenant = a;
    req.dbUse = db;
    req.tenancy = tenant;
    next();
  },

  observerRoutes
);

app.use("/customerTaxi", custTomerTaxiRoutes); // taxiImagePubRoutes
app.use("/cashTaxi", cashTaxiRoutes);
app.use("/taxipub", taxiImagePubRoutes);
app.post("/postuser", function (req, res, next) {
  console.log(req.body);
  res.status(200).json({
    data: "user exist with this phone number",
  });
});
app.use((req, res, next) => {
  const error = new Error("Not found ");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//process.on()

module.exports = app;
