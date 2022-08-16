const slowFunction = (tab) => {
  let montant = 0;
  let tabP = [];
  tab.forEach((elt) => {
    tabP = [...tabP, ...elt["products"]];
    /* elt["products"].forEach((prod) => {
      montant = montant + parseInt(elt.cartdetails.totalPrice);
    });*/
    if (elt.montantReduction) {
      montant = montant + elt.montantReduction;
    } else {
      montant = montant + elt.cartdetails.totalPrice;
    }
  });

  return { tab: tabP, montant: montant };
};

process.on("message", (tab) => {
  if (tab.length) {
    console.log("Child process received START message");
    let result = slowFunction(tab);
    let message = `{"result":${result}}`;
    process.send(result);
    process.exit();
  }
});
