const StorageModel = require("../api/models/Storage");
const tenant = require("../getTenant");
const dbl = "customerDb";
const axios = require("axios");
class SendLocalData {
  constructor() {
    this.ready = true;
    if (SendLocalData.instance == null) {
      SendLocalData.instance = this;
    }
    // this.URI = URI;
    return SendLocalData.instance;
  }

  init(URI) {
    let tab = [];
    this.ready = false;
    return new Promise(async (resolve, reject) => {
      let database = StorageModel;
      /* await tenant.getModelByTenant(
        dbl,
        "storage",
        StorageModel
      );*/

      database
        .find({
          status: false,
        })
        .lean()
        .exec()
        .then((docs) => {
          if (docs && docs.length) {
            console.log("in storage===>", docs.length);
            docs.forEach(async (doc) => {
              try {
                let res = await send(doc, URI);

                tab.push(doc);
                if (tab.length == docs.length) {
                  resolve(true);
                }
              } catch (error) {
                // console.log("remote server not avaible===>");
                tab.push(doc);
                if (tab.length == docs.length) {
                  resolve(true);
                }
              }
            });
          } else {
            ///  console.log("nothing in storage....>", docs.length);
            resolve(true);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const senToserver = new SendLocalData();
//console.log(senToserver);

//Object.freeze(senToserver);

function send(doc) {
  return new Promise(async (resolve, reject) => {
    if (
      doc.url === "http://18.157.225.135:3000/users/login" ||
      doc.url === "http://18.157.225.135:3000/employe/login" ||
      doc.url === "http://localhost:3000/managerinventory/" ||
      doc.url === "http://18.157.225.135:3000/managerinventory/" ||
      doc.url === "https://warm-caverns-20968.herokuapp.com/employe/login" ||
      doc.url === "https://warm-caverns-20968.herokuapp.com/managerinventory"
    ) {
      let database = StorageModel;
      /* await tenant.getModelByTenant(
        dbl,
        "storage",
        StorageModel
      );*/
      database.findOneAndRemove({ _id: doc._id }, (err, data) => {
        if (err) {
          console.log(err);
        }
        // reject(doc);
      });
    }

    var config = {
      method: doc.method,
      url: doc.url,
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      },
      data: doc.data,
    };

    axios(config)
      .then(async (response) => {
        let database = StorageModel;
        /* await tenant.getModelByTenant(
          dbl,
          "storage",
          StorageModel
        );*/

        database.findByIdAndRemove(doc._id, (err, data) => {
          if (err) {
            console.log(err);
          }
          resolve(doc);
        });
      })
      .catch(async (error) => {
        console.log(" enabble to post this doc", doc.url);
        if (
          doc.url === "http://18.157.225.135:3000/users/login" ||
          doc.url === "http://18.157.225.135:3000/employe/login" ||
          doc.url === "http://localhost:3000/managerinventory/" ||
          doc.url === "http://18.157.225.135:3000/managerinventory/" ||
          doc.url ===
            "https://warm-caverns-20968.herokuapp.com/employe/login" ||
          doc.url ===
            "https://warm-caverns-20968.herokuapp.com/managerinventory"
        ) {
          let database = StorageModel;
          /*await tenant.getModelByTenant(
            dbl,
            "storage",
            StorageModel
          );*/
          database.findOneAndRemove({ _id: doc._id }, (err, data) => {
            if (err) {
              console.log(err);
            }
            reject(doc);
          });
        }
        reject(error);
      });
  });
}

module.exports = senToserver;
