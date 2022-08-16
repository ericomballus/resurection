const maeriProduct = require("../api/models/Maeri_Product");
removeProduct = (Id) => {
  return new Promise((resolve, reject) => {
    maeriProduct
      .find({ categoryId: Id })
      .lean()
      .exec((err, cat) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        cat.forEach((elt) => {
          maeriProduct
            .remove({ _id: elt._id })
            .exec()
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        resolve("ok");
      });
  });
};

module.exports = removeProduct;
