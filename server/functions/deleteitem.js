const Items = require("../api/models/ProductItem");
const Pack = require("../api/models/ProductPack");
const Packitems = require("../api/models/ProductPackItem");

module.exports.delitem = function(id) {
  Items.findByIdAndDelete(id, (err, result) => {
    if (err && result) {
      console.log("error items");
    }
    console.log("ok items delete");
  })
    .exec()
    .then(result => {
      console.log(result);
      // res.status(200).json({ message: "image supprimé avec succé" });
    });
};

function delepack1(imgId) {
  Pack.find({ productId: imgId }).then(elt => {
    elt.forEach(lepack => {
      delpack2(lepack._id);
    });
  });
}
function delpack2(id) {
  Pack.findByIdAndDelete(id, (err, result) => {
    if (err && result) {
      console.log("error items");
    }
    console.log("ok items delete");
  })
    .exec()
    .then(result => {
      console.log(result);
      // res.status(200).json({ message: "image supprimé avec succé" });
    });
}

function delpackitems(id) {
  Packitems.find({ productId: id }).then(tabelt => {
    tabelt.forEach(elt => {
      delpackitems2(elt._id);
    });
  });
}

function delpackitems2(pid) {
  Packitems.findByIdAndDelete(pid, (err, result) => {
    if (err && result) {
      console.log("error items");
    }
    console.log("ok items delete");
  })
    .exec()
    .then(result => {
      console.log(result);
      // res.status(200).json({ message: "image supprimé avec succé" });
    });
}
