const gammeSchema = require("../api/models/Gamme");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const dbl = "customerDb";
let notFound = [];
function saveProduct(product, URL) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(dbl, "gamme", gammeSchema);

    //  let url = req.protocol + "://" + "localhost:3000" + req.url;
    // console.log("serveur gamme=====>", product);
    // if (product.url) {
    const path = "./localimages2/" + product.name;

    try {
      // console.log("exists:", path);
      // reject("exist deja");
      const verificateur = "./localimages2/" + product.name;
      if (fs.existsSync(verificateur)) {
        console.log("====le fichire existe deja ====");
        database
          .find({ _id: product._id })
          .lean()
          .exec((err, products) => {
            if (products && products.length) {
              // reject("existe");
              product["imageId"] = product.name;
              product["filename"] = product.name;
              let url = `http://127.0.0.1:3030/gamme/${product._id}?filename=${product.name}`;
              product.url = url;
              database
                .findOneAndUpdate(
                  { _id: product._id },
                  { $set: product },
                  { new: true }
                )
                .exec()
                .then((result) => {
                  console.log("gammme update here now===>", result);
                  resolve(result);
                });
            } else {
              product["imageId"] = product.name;
              product["filename"] = product.name;
              let url = `http://127.0.0.1:3030/gamme/${product._id}?filename=${product.name}`;
              product.url = url;
              database.create(product).then(async (resultat) => {
                resolve(resultat);
              });
            }
          });
        // resolve(product);
      } else {
        let url = product.url;
        let filename = product.name;
        const writeStream = fs.createWriteStream(dir + "/" + filename);
        http
          .request(url, (response) => {
            let data = new Stream();
            response.on("data", (chunk) => {
              data.push(chunk);
            });
            response.on("end", () => {
              fs.writeFileSync("./localimages2/" + filename, data.read());
              product["imageId"] = product.name;
              product["filename"] = product.name;
              let url = `http://127.0.0.1:3030/gamme/${product._id}?filename=${product.name}`;
              product.url = url;
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
          })
          .on("error", (err) => {
            notFound.push(product);
            console.log(
              "il ya erreur impossible de telecharger pour limage",
              notFound.length
            );
            reject(err);
          })
          .end(() => {});
      }
    } catch (err) {
      const dir = "./localimages2";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); //creating folder
      }

      let url = product.url;
      let filename = product.name;
      const verificateur = "./localimages2/" + product.name;
      if (fs.existsSync(verificateur)) {
        resolve(product);
      } else if (url && filename) {
        const writeStream = fs.createWriteStream(dir + "/" + filename);
        http
          .request(url, (response) => {
            let data = new Stream();
            response.on("data", (chunk) => {
              data.push(chunk);
            });
            response.on("end", () => {
              fs.writeFileSync("./localimages2/" + filename, data.read());
              product["imageId"] = product.name;
              product["imageId"] = product.name;
              product["filename"] = product.name;
              let url = `http://127.0.0.1:3030/gamme/${product._id}?filename=${product.name}`;
              product.url = url;
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
          })
          .on("error", (err) => {
            console.log("gamme url erreur ici====>", product.name);
            reject(product);
          })
          .end(() => {
            // let url = `http://127.0.0.1:3030/image?filename=${product.filename}`;
            // let url = `${URL}/image?filename=${product.filename}`;
            //  product.url = url;
          });
      } else {
        resolve(true);
      }
    }
    // }
  });
}
function getAllGammeList(URL, adminId) {
  return new Promise(async (resolve, reject) => {
    let url = URL + "/gamme" + `?db=${adminId}`;
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
        let result = response.data;

        let tab = [];
        if (result.length) {
          for (const product of result) {
            try {
              let res = await saveProduct(product, URL);
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
            } catch (prod) {
              console.log(
                "erreur de sauvegarde image ligne 224==>",
                product.name
              );
              let res = await saveProduct(product, URL);
              tab.push(res);
              notFound.push(prod);
              if (tab.length == result.length) {
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
              } else {
                console.log("je ne sors pas====>");
              }
            }
          }
          /* result.forEach(async (product) => {
            // console.log(product);
            try {
              let res = await saveProduct(product, URL);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              console.log(error);
            }
          });*/
        } else {
          resolve(result);
        }

        // ;
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}
module.exports = getAllGammeList;
