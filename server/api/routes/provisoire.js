router.post("/employe/:id", (req, res, next) => {
  console.log(req.body);
  console.log("eric");
  User.find({ _id: req.params.id })
    .exec()
    .then(user => {
      if (user.length <= 0) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      let userId = req.params.id;

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err
          });
        }
        let employe = {
          name: req.body.name,
          password: hash,
          poste: req.body.poste,
          // email: req.body.email,
          role: req.body.role,
          telephone: req.body.telephone
        };
        User.findOneAndUpdate(
          { _id: userId },
          { $push: { employes: employe } },
          function(error, success) {
            if (error) {
              console.log(error);
            } else {
              //console.log(success)
              User.findOne({ _id: userId }).then(doc => {
                res.status(201).json({
                  message: "ajouté ",
                  resultat: doc
                  // professeur: prof
                });
              });
            }
          }
        );
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
