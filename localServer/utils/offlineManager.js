const findToRemote = require("../middleware/remoteServer");
const StorageModel = require("../api/models/Storage");
const tenant = require("../getTenant");
const internetStatus = require("../utils/checkInternet");
const listenRemote = require("../utils/listenRemoteServer");
const dbl = "customerDb";
const offlineHandler = async (req, res, next) => {
  // let URL = "http://18.157.225.135:3000" + req.url;
  // let URI = "http://18.157.225.135:3000";
  let URL = "https://warm-caverns-20968.herokuapp.com" + req.url;
  let URI = "https://warm-caverns-20968.herokuapp.com";
  // console.log("internet status here", internetStatus.avaible);
  // let URL = "http://localhost:3000" + req.url;
  // let URI = "http://localhost:3000";
  // let URL = "http://192.168.1.155:3000" + req.url;
  // let URI = "http://192.168.1.155:3000";
  req.URI = URI;

  if (
    req.url.startsWith("/cashOpen") ||
    req.url.startsWith("/admininventory") ||
    req.url.includes("print/") ||
    req.url.includes("/images/")
  ) {
    next();
  } else if (req.method == "GET") {
    console.log("request get here");
    next();
  } else {
    if (internetStatus.avaible) {
      findToRemote(req, res, URI)
        .then((result) => {
          if (result && result.isAdmin) {
            res.status(200).json(result.data);
          } else {
            next();
          }
        })
        .catch(async (error) => {
          let database = StorageModel;
          /*await
           tenant.getModelByTenant(
            dbl,
            "storage",
            StorageModel
          );*/
          // console.log("local storage save here===>", req.method);
          if (
            req.method == "POST" ||
            req.method == "PATCH" ||
            req.method == "DELETE"
          ) {
            // let URL = "http://18.157.225.135:3000" + req.url;
            let doc = {
              url: URL,
              data: req.body,
              status: false,
              method: req.method,
            };
            if (
              doc.url === "http://18.157.225.135:3000/users/login" ||
              doc.url === "http://18.157.225.135:3000/employe/login" ||
              doc.url === "http://localhost:3000/users/login" ||
              doc.url === "http://localhost:3000/employe/login" ||
              doc.url ===
                "https://warm-caverns-20968.herokuapp.com/employe/login" ||
              doc.url === "https://warm-caverns-20968.herokuapp.com/users/login"
            ) {
              //dont' save
              next();
            } else {
              database.create(doc).then((data) => {
                //console.log("save result", data);
                console.log("local storage save this doc ===>", data.method);
              });
              next();
            }
          } else {
            next();
          }
        });
    } else {
      listenRemote.setIsListen(false);
      let database = StorageModel;
      /* await tenant.getModelByTenant(
        dbl,
        "storage",
        StorageModel
      );*/
      // console.log("local storage save here===>", req.method);
      if (
        req.method == "POST" ||
        req.method == "PATCH" ||
        req.method == "DELETE"
      ) {
        // let URL = "http://18.157.225.135:3000" + req.url;
        let doc = {
          url: URL,
          data: req.body,
          status: false,
          method: req.method,
        };
        if (
          doc.url === "http://18.157.225.135:3000/users/login" ||
          doc.url === "http://18.157.225.135:3000/employe/login" ||
          doc.url === "http://localhost:3000/users/login" ||
          doc.url === "http://localhost:3000/employe/login" ||
          doc.url ===
            "https://warm-caverns-20968.herokuapp.com/employe/login" ||
          doc.url === "https://warm-caverns-20968.herokuapp.com/users/login"
        ) {
          //dont' save
          next();
        } else {
          database.create(doc).then((data) => {
            //console.log("save result", data);
            //console.log("local storage save this doc ===>", data.method);
          });
          next();
        }
      } else {
        next();
      }
    }
  }
};

module.exports = offlineHandler;
