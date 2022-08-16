const packSchema = require("../api/models/ProductPack");
const axios = require("axios");
const tenant = require("../getTenant");
const dbl = "customerDb";
function getAllPack(adminId, URL) {
  return new Promise(async (resolve, reject) => {
    let url = URL + "/pack/admin/" + adminId + `?db=${adminId}`;
    // let url = "http://18.157.225.135:3000" + "/products/adminId/" + adminId;
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
        let result = response.data.docs;

        // resolve(response.data.docs);
        // console.log("voici les packs", result);
        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            // console.log(product);
            try {
              let res = await savePack(product);
              // console.log("voici les packs", resp);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              console.log(error);
            }
          });
        } else {
          resolve(result);
        }
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}
function savePack(product) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(dbl, "packs", packSchema);

    database
      .find({ _id: product._id })
      .lean()
      .exec((err, products) => {
        if (products && products.length) {
          // reject("existe");
          database
            .findOneAndUpdate(
              { _id: product._id },
              { $set: product },
              { new: true }
            )
            .exec()
            .then((result) => {
              // console.log("product update here===>", result);
              resolve(result);
            });
        } else {
          //
          database.create(product).then(async (resultat) => {
            resolve(resultat);
          });
        }
      });
  });
}

module.exports = getAllPack;
