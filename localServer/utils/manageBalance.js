const Balance = require("../api/models/Customer_Balance");
let Customer = require("../api/models/Custumer");
module.exports = (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await require("../api/models/Custumer").find({
        _id: req.body.customer._id,
      });
      let customer = user[0];
      // console.log(customer);
      let amount = customer.solde - req.body.commande.montantRecu;
      // console.log(amount);
      const balance = new Balance({
        customerId: req.body.customer._id,
        withdrawal: true,
        amountWithdrawal: parseInt(req.body.commande.montantRecu),
        amount: amount,
      });
      balance.save().then(async (data) => {
        console.log("custumer created", data);
        let Id = data["customerId"];
        const filter = { _id: Id };
        const update = { solde: data["amount"] };
        let result = await Customer.findOneAndUpdate(
          filter,
          { $set: update },
          { new: true }
        );
        resolve(result);
      });
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
};
