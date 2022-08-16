const productSchema = require("../api/models/ProductItem");
const productSchema2 = require("../api/models/Product");
const tenant = require("../getTenant");
const ImagesStore = require("../api/models/ImagesStore");
const mongoose = require("mongoose");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const dbl = "customerDb";
const axios = require("axios");
function saveProductItem(product) {
  return new Promise(async (resolve, reject) => {
    const dir = "./localimages2";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); //creating folder
    }
    let database = await tenant.getModelByTenant(
      dbl,
      "productitems",
      productSchema
    );
    let database2 = await tenant.getModelByTenant(
      dbl,
      "products",
      productSchema2
    );
    let url = null;
    let filename = product.filename;
    // let remoteUrl = "http://localhost:3000/";
    let remoteUrl = "http://18.157.225.135:3000/";
    if (product.maeriId !== "nothing") {
      url =
        remoteUrl +
        `maeriproducts/${product["maeriId"]}` +
        "?db=" +
        product.adminId;
      // remoteUrl + `products/${product._id}` + "?db=" + product.adminId;
      // /products/623012ab7577991eec29bd46?db=6202be67bbb9eb17f8fbbd24
    }

    if (url) {
      console.log("voici url ici======>", url);
      http
        .request(url, (response) => {
          let data = new Stream();
          response.on("data", (chunk) => {
            data.push(chunk);
          });
          response.on("end", () => {
            fs.writeFileSync("./localimages2/" + product._id, data.read());
          });
        })
        .on("error", (err) => {
          /* console.log(
      "il ya erreur impossible de joindre le serveur distant"
    );*/
          reject(err);
        })
        .end(() => {
          // const Image =
          /* ImagesStore({
            // _id: new mongoose.Types.ObjectId(),
            adminId: product.adminId,
            filename: product._id,
            originalname: product._id,
          });*/
          ImagesStore.create({
            // _id: Date.now(),
            adminId: product.adminId,
            filename: product._id,
            originalname: product._id,
          }).then((data) => {
            // Image.save().then((data) => {
            //  let url = URL + "/products/adminId/" + adminId;
            let url = `${URL}/images/${data._id}`;
            //  product.url = url;
            product["imageId"] = data._id;
            product["maeriId"] = null;
            console.log("id is here from======>", data._id);
            database
              .find({ _id: product._id })
              .lean()
              .exec((err, products) => {
                if (products && products.length) {
                  // reject("existe");
                  console.log("update this product items======>", product);
                  database
                    .findOneAndUpdate(
                      { _id: product._id },
                      { $set: product },
                      { new: true }
                    )
                    .exec()
                    .then((result) => {
                      //console.log("product update here===>", result);
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
        });
    } else {
      try {
        let parent = await database2
          .find({ _id: product.productId })
          .lean()
          .exec();
        if (parent) {
          product["imageId"] = parent[0]["imageId"];
          let docs = await database.find({ _id: product._id }).lean().exec();
          if (docs && docs.length) {
            // reject("existe");
            let result = await database
              .findOneAndUpdate(
                { _id: product._id },
                { $set: product },
                { new: true }
              )
              .exec();
            resolve(result);
          } else {
            database.create(product).then(async (resultat) => {
              resolve(resultat);
            });
          }
        } else {
          console.log("not found ===>", product.name);
          resolve(true);
        }
      } catch (error) {}
    }
  });
}
function getAllProductItem(URL, adminId) {
  return new Promise(async (resolve, reject) => {
    let url = URL + "/productsitem" + `?db=${adminId}`;
    // let url = "http://18.157.225.135:3000" + "/products/adminId/" + adminId    productsitem/${this.id}/update?db=${this.id};
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
        // resolve(result);
        let result = response.data.items;
        result = result.filter((prod) => prod.desabled == false);

        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            if (!product["productId"]) {
            } else {
              if (product.maeriId == "nothing") {
              } else {
                product["url"] = URL + `/maeriproducts/${product["maeriId"]}`;
              }
            }
            try {
              let res = await saveProductItem(product);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              console.log(error);
              tab.push(product);
              if (tab.length == result.length) {
                resolve(tab);
              }
            }
          });
        } else {
          resolve(result);
        }
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}
module.exports = getAllProductItem;
