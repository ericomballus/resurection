const productSchema = require("../api/models/Product");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const ImagesStore = require("../api/models/ImagesStore");
const mongoose = require("mongoose");
const dbl = "customerDb";
function saveProduct(product, URL) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(
      dbl,
      "products",
      productSchema
    );
    console.log(product);
    //  let url = req.protocol + "://" + "localhost:3000" + req.url;
    if (product.filename && product.filename.length) {
      const path = "./localimages2/" + product.filename;

      const dir = "./localimages2";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); //creating folder
      }
      // this.url + `maeriproducts/${article['maeriId']}`;
      let url = product.url;
      let filename = product.filename;
      // let remoteUrl = "http://localhost:3000/";
      let remoteUrl = "http://18.157.225.135:3000/";
      if (product.maeriId && product.maeriId !== "nothing") {
        url =
          /* remoteUrl +
          `maeriproducts/${product["maeriId"]}` +
          "?db=" +
          product.adminId;*/
          remoteUrl + `products/${product._id}` + "?db=" + product.adminId;
        // /products/623012ab7577991eec29bd46?db=6202be67bbb9eb17f8fbbd24

        //  console.log("voici url ici======>", url);
      }

      if (url && filename) {
        const writeStream = fs.createWriteStream(dir + "/" + filename);
        http
          .request(url, (response) => {
            let data = new Stream();
            response.on("data", (chunk) => {
              data.push(chunk);
            });
            response.on("end", () => {
              fs.writeFileSync("./localimages2/" + filename, data.read());
            });
          })
          .on("error", (err) => {
            /* console.log(
              "il ya erreur impossible de joindre le serveur distant"
            );*/
            reject(err);
          })
          .end(() => {
            const Image = new ImagesStore({
              _id: new mongoose.Types.ObjectId(),
              adminId: product.adminId,
              filename: product.filename,
              originalname: product.filename,
            });
            Image.save().then((data) => {
              //  let url = URL + "/products/adminId/" + adminId;
              let url = `${URL}/images/${data._id}`;
              //  product.url = url;
              product["imageId"] = data._id;
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
      }
    }
  });
}
function getAllProduct(URL, adminId) {
  // console.log("hello===>", URL, adminId);
  return new Promise(async (resolve, reject) => {
    let url = URL + "/products/adminId/" + adminId;
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
        let result = response.data.products;

        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            try {
              let res = await saveProduct(product, URL);
              // console.log("retour ici==>", res);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {}
          });
        } else {
          resolve(tab);
        }

        //
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}
module.exports = getAllProduct;
