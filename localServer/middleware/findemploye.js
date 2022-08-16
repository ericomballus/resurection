const bcrypt = require("bcryptjs");

function findEmploye(tab, req, res) {
  console.log("password");
  console.log(req.body.password);
  console.log(tab);
  let employe = [];
  let a = "test";
  return new Promise(async (resolve, reject) => {
    tab.forEach((elt) => {
      //console.log(elt);
      console.log(elt.password);
      /* if (parseInt(elt.password) === parseInt(req.body.password)) {
        employe.push(elt);
      } */

      bcrypt.compare(req.body.password, elt.password, (err, result) => {
        if (err) {
          console.log("failded");
        }
        if (result) {
          let tab = [];
          tab.push(elt);
          employe = tab;
          console.log("c'est bon");
          console.log(tab);
          resolve(employe);
          return;
          // employe.push(elt);
        }
      });
    });
    console.log(employe);
    /* if (employe.length > 0) {
      resolve(employe);
    } else {
      // reject(new Error("auth failed!"));
      res.status(401).json({
        message2: `Auth failed password,is not correct`
      });
    }*/
  });
}

module.exports = findEmploye;
