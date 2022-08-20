function glacerManager(req, res) {
  req.tenant
    .findById({ _id: req.body.id })
    .exec()
    .then((doc) => {
      console.log(doc);
      let obj = {
        name: doc.name,
        quantityItems: req.body.quantity,
        idprod: doc._id,
      };
      let prod_glace;
      let qtyGlace = parseInt(req.body.quantity);
      let quantityInStore = parseInt(doc.quantityStore);
      let nonglace = quantityInStore - parseInt(req.body.quantity);
      if (doc.glace) {
        prod_glace = parseInt(req.body.quantity) + doc.glace;
      } else {
        prod_glace = parseInt(req.body.quantity);
      }

      req.tenant.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            glace: prod_glace,
            nonglace: parseInt(nonglace),
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
          } else {
            // warehouseTransaction(req, obj);
            req.io.sockets.emit(
              `${req.params.adminId}productItemGlace`,
              success
            );
            res.status(201).json({
              message: "update ",
              resultat: success,
              // professeur: prof
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
}

module.exports = glacerManager;
