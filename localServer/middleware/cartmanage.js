var { promisify } = require("util");
const Item = require("../api/models/ProductItem");
const ProductPack = require("../api/models/ProductPack");
const ProductPackitems = require("../api/models/ProductPackItem");

var manageCart = (data, res) => {
  console.log(data);

  /* return new Promise((resolve, reject) =>{
    data.forEach(element => {
        if (element["item"]["thetype"] === "packitems") {
         let result1= updatePackItems(element);
        } else {
          let result2= updateItems(element);
        }
      });
  }) */
  return Promise.all([updatePackItems, updateItems]);
};

var updatePackItems = data => {
  data.forEach(element => {
    if (element["item"]["thetype"] === "packitems") {
      // let result1= updatePackItems(element);
      const id = element["item"]["_id"];
      let stock = element["item"]["quantity"];
      let qty = element["qty"];
      let quantity = stock - qty;
      // console.log(req.body);
      const updateOps = { quantity: quantity };
      ProductPackitems.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
          console.log("okokok packupdate", result);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // let result2 = updateItems(element);
    }
  });
};
var updateItems = data => {
  data.forEach(element => {
    if (element["item"]["thetype"] === "productitems") {
      // let result1= updatePackItems(element);
      const id = element["item"]["_id"];
      let stock = element["item"]["quantity"];
      let qty = element["qty"];
      let quantity = stock - qty;
      // console.log(req.body);
      const updateOps = { quantity: quantity };
      Item.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
          console.log("okokok packupdate", result);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // let result2= updateItems(element);
    }
  });
};
/*
updateItems(element => {
  const id = element["item"]["_id"];
  let stock = element["item"]["quantity"];
  let qty = element["qty"];
  let quantity = stock - qty;
  // console.log(req.body);
  const updateOps = { quantity: quantity };
  Item.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log("okokok itemsupdate", result);
    })
    .catch(err => {
      console.log(err);
      
    });
});  */
/*
updatePackItems(element => {
  const id = element["item"]["_id"];
  let stock = element["item"]["quantity"];
  let qty = element["qty"];
  let quantity = stock - qty;
  // console.log(req.body);
  const updateOps = { quantity: quantity };
  ProductPackitems.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log("okokok packupdate", result);
    })
    .catch(err => {
      console.log(err);
    });
}); */

var promiseManage = promisify(manageCart);

module.exports = manageCart;
