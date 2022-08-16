const StorageModel = require("../api/models/Storage");
const tenant = require("../getTenant");
const dbl = "customerDb";
const axios = require("axios");
const makePost = async (data, URL, method) => {
  // let URL = "http://18.157.225.135:3000" + req.url;
  // let URI = "http://18.157.225.135:3000";
  //  let URL = "http://localhost:3000" + req.url;  172.20.10.4
  //let URI = "http://localhost:3000" + URL;
  let URI = "http://18.157.225.135:3000" + URL;
  var config = {
    method: method,
    url: URI,
    headers: {
      Authorization: "Basic Og==",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(async (response) => {})
    .catch(async (error) => {
      let database = await tenant.getModelByTenant(
        dbl,
        "storage",
        StorageModel
      );

      let doc = {
        url: URI,
        data: data,
        status: false,
        method: method,
      };
      database.create(doc).then((data) => {
        console.log("local storage save this doc from makePost ===>", method);
      });
    });
};

module.exports = makePost;
