const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Employe = require("../api/models/Employe");
const Customer = require("../api/models/Custumer");
const getAllProduct = require("../utils/saveProducts");
const getAllProductItem = require("../utils/saveProductItems");
const getAllPack = require("../utils/savePack");
const getProductResto = require("../utils/saveResto");
const getProductList = require("../utils/saveShopList");
const getServiceList = require("../utils/saveServiceList");
const getSetting = require("../utils/saveSetting");
const getAllGammeList = require("../utils/saveGammeList");
const getProductRestoItems = require("../utils/saveRestoItems");
const getTransaction = require("../utils/saveTransactions");
const getCashOpen = require("../utils/saveCashOpen");
const getInvoices = require("../utils/saveInvoices");
const getBills = require("../utils/saveBills");
const getPurchases = require("../utils/savePurchases");
const listenRemote = require("../utils/listenRemoteServer");
const User = require("../api/models/user");
function findToRemoteServer(req, res, URI) {
  console.log("find to remote server here===>", URI);
  return new Promise(async (resolve, reject) => {
    let url = URI + req.url;
    let URL = URI;
    if (req.method == "GET") {
    }
    let config = {
      method: req.method,
      url: url,
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      },
      data: req.body,
    };

    axios(config)
      .then(async (response) => {
        let result = response.data;
        //);
        if (req.url == "/users/login" || req.url == "/employe/login") {
          if (req.url == "/users/login") {
            let adminId = result["user"][0]["_id"];
            getAllUser(req, res, adminId, URI)
              .then(async (users) => {
                createAdmin(result["user"][0]);
                getAllCustommer(req, res, adminId, URI);
                getAllPatient(req, res, adminId, URI);
                //console.log("admin account here ===>", result["user"][0]);

                let adminUser = result["user"][0];
                let storeType = [];
                storeType = result["user"][0]["storeType"];
                let company = await getSetting(adminId, URL);
                getPurchases(URL, adminId);
                //[ 'bar', 'resto', 'shop' ].includes(),
                if (storeType.includes("bar")) {
                  let products = await getAllProduct(URL, adminId);
                  let productItems = await getAllProductItem(URL, adminId);
                  let packs = await getAllPack(adminId, URL);
                }
                if (storeType.includes("resto")) {
                  let resto = await getProductResto(URL, adminId);
                  let restoitems = await getProductRestoItems(URL, adminId);
                }
                if (storeType.includes("shop")) {
                  let List = await getProductList(URL, adminId);
                }

                if (storeType.includes("services")) {
                  let serviceList = await getServiceList(URL, adminId, req);

                  let gammeList = await getAllGammeList(URL, adminId);
                }
                if (req.url == "/users/login") {
                  resolve({ isAdmin: true, data: response.data });
                } else {
                  resolve({ isAdmin: false, data: response.data });
                }
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            let adminId = result["user"][0]["adminId"];
            let storeId = result["user"][0]["storeId"];
            let url = URI + `/users/takeuser/${adminId}`;
            var config = {
              method: "GET",
              url: url,
              headers: {
                Authorization: "Basic Og==",
                "Content-Type": "application/json",
              },
            };

            axios(config)
              .then(async (response) => {
                let storeType = [];
                let arrOfPromise = [];
                storeType = response.data["users"][0]["storeType"];
                try {
                  let openCash = await getCashOpen(URL, adminId, storeId);
                  let company = await getSetting(adminId, URL);

                  if (openCash && openCash.open) {
                    await getInvoices(URL, adminId, openCash._id);
                    await getBills(URL, adminId, openCash._id);
                    // arrOfPromise.push(getInvoices(URL, adminId, openCash._id));
                    // arrOfPromise.push(getBills(URL, adminId, openCash._id));
                  }
                  //  resolve({ isAdmin: false, data: response.data });
                  console.log(
                    "==============start getting data here ok==================="
                  );

                  if (storeType.includes("bar")) {
                    let products = await getAllProduct(URL, adminId);
                    let productItems = await getAllProductItem(URL, adminId);
                    let packs = await getAllPack(adminId, URL);
                    console.log(
                      "==============bar ok====ok==================="
                    );
                    // arrOfPromise.push(getAllProduct(URL, adminId));
                    // arrOfPromise.push(getAllProductItem(URL, adminId));
                    // arrOfPromise.push(getAllPack(adminId, URL));
                  }

                  if (storeType.includes("resto")) {
                    let resto = await getProductResto(URL, adminId);
                    let restoitems = await getProductRestoItems(URL, adminId);
                    console.log(
                      "==============bar resto okok==================="
                    );
                    // arrOfPromise.push(getProductResto(URL, adminId));
                    // arrOfPromise.push(getProductRestoItems(URL, adminId));
                  }
                  if (storeType.includes("shop")) {
                    let List = await getProductList(URL, adminId);
                    // arrOfPromise.push(getProductList(URL, adminId));
                  }

                  if (storeType.includes("services")) {
                    console.log(
                      "======start query all services list here======"
                    );

                    await getServiceList(URL, adminId);
                    await getAllGammeList(URL, adminId);

                    // arrOfPromise.push(getServiceList(URL, adminId));
                    // arrOfPromise.push(getAllGammeList(URL, adminId));
                  }
                  getAllCustommer(req, res, adminId, URI);
                  getAllPatient(req, res, adminId, URI);

                  getPurchases(URL, adminId);
                  await getTransaction(URL, adminId, storeId);
                  let id = await listenRemote.setStoreId2(storeId);
                  listenRemote.start(adminId, URI);
                  resolve({ isAdmin: false, data: response.data });
                } catch (error) {
                  console.log("some error here====>", error);
                  // resolve({ isAdmin: false, data: response.data });
                }
              })
              .catch((err) => {
                console.log(err);
                // reject(err);
              });
          }
        } else {
          if (!listenRemote.isListen) {
            // si le local serveur socket client n'es pas demarré je le demarre
            listenRemote.start(adminId, URI);
            setTimeout(async () => {
              await getServiceList(URL, adminId, req);
              await getAllGammeList(URL, adminId);
              if (req.query.storeId) {
                let storeId = req.query.storeId;
                await getTransaction(URL, adminId, storeId);
              }
            }, 30000);
          }
          resolve(result);
        }
      })
      .catch((error) => {
        // console.log(error);
        reject(error);
      });
  });
}

function getAllUser(req, res, adminId, URI) {
  return new Promise(async (resolve, reject) => {
    let url = URI + "/employe/" + adminId;
    // let url = "http://18.157.225.135:3000" + "/employe/" + adminId;
    var config = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        let result = response.data;
        // console.log("all les user ici", response);
        resolve(result);
        let allUser = result["employes"];
        let tab = [];
        allUser.forEach(async (user) => {
          try {
            let result = await saveUser(user);
            // tab.push(result);
          } catch (error) {
            // console.log(error);
          }
        });
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}

function saveUser(user) {
  return new Promise((resolve, reject) => {
    Employe.find({ telephone: user.telephone })
      .exec()
      .then((docs) => {
        if (docs.length >= 1) {
          reject("existe deja");
        } else {
          const employe = new Employe(user);
          employe
            .save()
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              console.log(err);
              reject("error created employe");
            });
        }
      });
  });
}

function createAdmin(admin) {
  User.find({ telephone: admin.telephone })
    // User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        // console.log("existe deja", user);
      } else {
        const user = new User(admin);
        user
          .save()
          .then((result) => {
            // console.log("admin", result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
}

function saveCustomer(user) {
  return new Promise(async (resolve, reject) => {
    let dbl = "customerDb";
    // const customerSchema = require("../api/models/Custumer");
    let database = require("../api/models/Custumer");
    /* let database = await require("../getTenant").getModelByTenant(
      dbl,
      "Custumer",
      require("../api/models/Custumer")
    );*/
    database
      .find({ phone: user.phone, adminId: user.adminId })
      .exec()
      .then((docs) => {
        if (docs.length >= 1) {
          console.log("client existe deja ===>");
          reject("existe deja");
        } else {
          database
            .create(user)
            // .save()
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              //console.log(err);
              reject("error created employe");
            });
        }
      });
  });
}

function savePatient(user) {
  return new Promise(async (resolve, reject) => {
    let dbl = "customerDb";
    // const customerSchema = require("../api/models/Custumer");
    let database = require("../api/models/Patient");
    /* let database = await require("../getTenant").getModelByTenant(
      dbl,
      "Custumer",
      require("../api/models/Custumer")
    );*/
    database
      .find({ phone: user.phone, adminId: user.adminId })
      .exec()
      .then((docs) => {
        if (docs.length >= 1) {
          console.log("client existe deja ===>");
          reject("existe deja");
        } else {
          database
            .create(user)
            // .save()
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              //console.log(err);
              reject("error created employe");
            });
        }
      });
  });
}

function getAllCustommer(req, res, adminId, URI) {
  // return new Promise((resolve, reject) => {
  let url = URI + `/custumer/${adminId}?db=${adminId}`;
  // let url = "http://18.157.225.135:3000" + "/employe/" + adminId;
  var config = {
    method: "GET",
    url: url,
    headers: {
      Authorization: "Basic Og==",
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      let result = response.data;
      let allUser = result["custumers"];
      let tab = [];
      allUser.forEach(async (user, index) => {
        try {
          let result = await saveCustomer(user);
          console.log(result);
          if (index == allUser.length - 1) {
            // resolve(true);
          }
        } catch (error) {
          if (index == allUser.length - 1) {
            //resolve(true);
          }
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      //  reject(error);
    });
  // });
}

function getAllPatient(req, res, adminId, URI) {
  // return new Promise((resolve, reject) => {
  let url = URI + `/patient/${adminId}?db=${adminId}`;
  // let url = "http://18.157.225.135:3000" + "/employe/" + adminId;
  var config = {
    method: "GET",
    url: url,
    headers: {
      Authorization: "Basic Og==",
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      let result = response.data;
      let allUser = result;
      let tab = [];
      allUser.forEach(async (user, index) => {
        try {
          let result = await savePatient(user);
          console.log(result);
          if (index == allUser.length - 1) {
            // resolve(true);
          }
        } catch (error) {
          if (index == allUser.length - 1) {
            //resolve(true);
          }
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      //  reject(error);
    });
  // });
}

module.exports = findToRemoteServer;
