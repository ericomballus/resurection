const serviceSchema = require("../api/models/Billard");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const { promises: Fs } = require("fs");
const tenant = require("../getTenant");
const axios = require("axios");
const ImagesStore = require("../api/models/ImagesStore");
const mongoose = require("mongoose");
const dbl = "customerDb";
let notFound = [];
function saveProduct(product, URL, adminId, index, total) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(dbl, "billard", serviceSchema);

    if (product.filename && product.filename.length) {
      const path = "./localimages2/" + product.filename;

      const dir = "./localimages2";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); //creating folder
      }

      if (product.filename) {
        product["url"] = URL + "/billard/" + product._id + "?db=" + adminId;
      }

      let url = product.url;
      let filename = product.filename;
      const verificateur = "./localimages2/" + product.filename;
      if (fs.existsSync(verificateur)) {
        database
          .findOneAndUpdate(
            { _id: product._id },
            { $set: product },
            { new: true }
          )
          .exec()
          .then((result) => {
            //console.log("product update here===>", result);
            resolve(product);
          });
      } else {
        http
          .request(url, (response) => {
            let data = new Stream();
            response.on("data", (chunk) => {
              data.push(chunk);
            });
            response.on("end", () => {
              fs.writeFileSync("./localimages2/" + filename, data.read());
              let uri = `http://127.0.0.1:3030/images?filename=${product.filename}`;
              product.url = uri;
              const Image = new ImagesStore({
                _id: new mongoose.Types.ObjectId(),
                adminId: product.adminId,
                filename: product.filename,
                originalname: product.filename,
                originalUrl: url,
                product: product,
              });
              Image.save().then((data) => {
                // let url = `http://127.0.0.1:3030/images/${data._id}`;
                let url = `${URL}/images/${data._id}`;
                // product.url = url;
                product["imageId"] = data._id;
                //  product["url"] = url;
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
                          resolve(product);
                        });
                    } else {
                      //
                      database.create(product).then(async (resultat) => {
                        resolve(product);
                      });
                    }
                  });
              });
            });
          })
          .on("error", (err) => {
            /* console.log(
          "il ya erreur impossible de telecharger pour limage",
          index,
          total,
          product
        );*/
            reject(product);
          })
          .end(() => {
            console.log("end request");
          });
      }
      // }
    }
  });
}
function getAllServiceList(URL, adminId) {
  return new Promise(async (resolve, reject) => {
    let url = URL + "/billard/adminId/all" + `?db=${adminId}`;

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
      .then(async (response) => {
        let result = response.data.product;
        // console.log(result);

        let tab = [];
        let m = [];
        if (result.length) {
          // for (const product of result) {
          result.forEach(async (product, index) => {
            console.log(index);
            if (product.filename) {
              try {
                let res = await saveProduct(
                  product,
                  URL,
                  adminId,
                  index,
                  result.length
                );
                tab.push(res);
                if (tab.length == result.length && !notFound.length) {
                  resolve(tab);
                } else if (notFound.length) {
                  notFound.forEach(async (product) => {
                    try {
                      let res = await saveProduct(
                        product,
                        URL,
                        adminId,
                        index,
                        result.length
                      );
                      tab.push(product);
                      notFound = notFound.filter(
                        (prod) => prod._id !== product._id
                      );
                    } catch (error) {}
                  });

                  resolve(tab);
                }
              } catch (product) {
                let res = await saveProduct(product, URL, adminId, 777, 777);
                tab.push(res);
                if (tab.length == result.length && !notFound.length) {
                  resolve(tab);
                } else if (notFound.length) {
                  notFound.forEach(async (product) => {
                    try {
                      let res = await saveProduct(
                        product,
                        URL,
                        adminId,
                        index,
                        result.length
                      );
                      tab.push(product);
                      notFound = notFound.filter(
                        (prod) => prod._id !== product._id
                      );
                    } catch (error) {}
                  });

                  resolve(tab);
                }

                // console.log(error);
              }
            } else {
            }

            // }
          });
        } else {
          resolve(result);
        }

        //
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}

async function exists(path) {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
}
module.exports = getAllServiceList;
