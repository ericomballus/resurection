const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Nexmo = require("nexmo");
var nexmo = new Nexmo(
  {
    apiKey: "cb2ca9ec",
    apiSecret: "bc096f405af421b0"
  },
  { debug: true }
);
const Cart = require("../class/cart");
const Item = require("../models/ProductItem");
const ProductPack = require("../models/ProductPack");
const ProductPackitems = require("../models/ProductPackItem");
const cartManage = require("../../middleware/cartmanage");
const Invoice = require("../models/invoice");
const jwt = require("jsonwebtoken");
const test = require("../../middleware/multytenant");

router.post("/ajouter/items/", test.db, test.tenant, (req, res, next) => {
  console.log(req.body);
  if (req.body.cart) {
    const panier = req.body.cart;
    var cart = new Cart(panier);

    // console.log(req.body.cart);
    console.log(cart);

    req
      .model("Product")
      .findOne({ _id: req.body.id }, "-__v")
      .exec()
      .then(Item => {
        console.log(Item);
        cart.add(Item, Item._id);

        const newCart = {
          cart: cart,
          products: cart.generateArray(),
          totalPrice: cart.totalPrice,
          totalQty: cart.totalQty
        };

        res.status(200).json({
          newCart: newCart
        });
      })

      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
    var cart = new Cart({});

    // Item.findById(req.body.id)
    req
      .model("Product")
      .findOne({ _id: req.body.id }, "-__v")
      .exec()
      .then(item => {
        console.log(item);
        cart.add(item, item.id);
        // cartValidator.cart = cart;

        const newCart = {
          cart: cart,
          products: cart.generateArray(),
          totalPrice: cart.totalPrice,
          totalQty: cart.totalQty
        };
        res.status(200).json({
          newCart: newCart
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
});

router.post("/ajouter/items/pack", test.tenantpackitems, (req, res, next) => {
  if (req.body.cart) {
    const panier = req.body.cart;
    var cart = new Cart(panier);

    console.log(req.body.cart);
    console.log(cart);

    req
      .model("Packitems")
      .findOne({ _id: req.body.id }, "-__v")
      .exec()
      .then(Item => {
        cart.add(Item, Item._id);

        const newCart = {
          cart: cart,
          products: cart.generateArray(),
          totalPrice: cart.totalPrice,
          totalQty: cart.totalQty
        };

        res.status(200).json({
          newCart: newCart
        });
      })

      .catch(err => {
        res.status(500).json({
          error: err
        });
        // ProductPackitems .findById(req.body.id)
      });
  } else {
    var cart = new Cart({});

    // Item.findById(req.body.id)
    req
      .model("Packitems")
      .findOne({ _id: req.body.id }, "-__v")
      .exec()
      .then(item => {
        console.log(item);
        cart.add(item, item.id);
        // cartValidator.cart = cart;

        const newCart = {
          cart: cart,
          products: cart.generateArray(),
          totalPrice: cart.totalPrice,
          totalQty: cart.totalQty
        };
        res.status(200).json({
          newCart: newCart
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
});

router.post("/reduire/items", (req, res, next) => {
  var productId = req.body.id;

  var cart = new Cart(req.body.cart);

  cart.reduceByOne(productId);

  const newCart = {
    cart: cart,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  };

  res.status(200).json({
    newCart: newCart
  });
});

router.post("/deleteincart/item/", (req, res, next) => {
  var productId = req.body.id;

  var cart = new Cart(req.body.cart);
  cart.removeItem(productId);

  const newCart = {
    cart: cart,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  };

  res.status(200).json({
    newCart: newCart
  });
});

router.post("/commande/items", (req, res, next) => {
  let tab = req.body.cart.products;
  let obj = req.body.cart.cartdetails;
  let invoice = new Invoice();
  console.log(req.body.cart.products);

  cartManage(tab, res).then(data => {
    console.log("ça marche!!!!", data);
    invoice.adminId = req.body.adminId;
    invoice.commande = obj;
    invoice
      .save()
      .then(resu => {
        console.log(resu);
        res.status(200).json({ message: "ok commande" });
      })

      .catch(err => {
        console.log(err);
      });
  });
});
/*
 } else {
    var cart = new Cart({}); 

// Item.findById(req.body.id)
     req
      .model("Pack")
      .findOne({ _id: req.body.id }, "-__v")
      .exec()
      .then(item => {
        console.log(item);
        cart.add(item, item.id);
        // cartValidator.cart = cart;

        const newCart = {
          cart: cart,
          products: cart.generateArray(),
          totalPrice: cart.totalPrice,
          totalQty: cart.totalQty
        };
        res.status(200).json({
          newCart: newCart
        });
      })
      .catch(err => {
        // ProductPackitems.findById(req.body.id)
        req
          .model("Pack")
          .findOne({ _id: req.body.id }, "-__v")
          .exec()
          .then(item => {
            console.log(item);
            // cart.add(item, item.id);
            // cartValidator.cart = cart;

            const newCart = {
              cart: cart,
              products: cart.generateArray(),
              totalPrice: cart.totalPrice,
              totalQty: cart.totalQty
            };
            res.status(200).json({
              newCart: newCart
            });
          });
      });


router.post("/commande/img", cartValidator, (req, res, next) => {
  const decodedcommande = jwt.verify(req.body.cart, "ericomballus");
  // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
  // console.log(decoded);
  // console.log(decodedcommande);

  if (!cartValidator.cart) {
    return res.status(404).json({
      message: "produit introuvable dans le panier"
    });
  }

  var cart = new Cart((cartValidator.cart = decodedcommande));
  const text = "nouvelle commande de" + cart;
  const number = req.body.number;

  //code nexmo pour les sms ici

  const commandes = new Commandes({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    phone: req.body.number,
    cart: decodedcommande,
    date: Date.now()
  });
  commandes
    .save()
    .then(resu => {
      cartValidator.cart = null;
      // console.log(resu.name);
      res.status(201).json({
        message: "Commande sauvegarder avec succés",
        createdCommande: {
          name: resu.name,
          phone: resu.phone
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//client consulde ses commandes

router.post("/commande/factures", checkAuth, (req, res, next) => {
  // const decoded = jwt.verify(token, process.env.JWT_KEY);
  const decoded = jwt.verify(req.body.token, "ericomballus");
  console.log(decoded);
  //const nomclient = req.body.name;
  const nomclient = decoded.name;

  Commandes.find({ name: nomclient }, function(err, docs) {
    if (err) {
      res.status(500).json({ error: err });
    }
    var cart;
    console.log(docs);
    // var productId = req.params.id;
    docs.forEach(function(doc) {
      console.log(doc);
      cart = new Cart(doc.cart);
      doc.cart.items = cart.generateArray();
      // console.log(doc.cart.items);
    });
    console.log(docs);
    res.status(200).json({
      docs: docs
    });
  }).catch(err => {
    res.status(500).json({
      errorcommmande: err
    });
  });
});

router.get("/reduire/:id", (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;

  res.status(200).json({
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
});

router.get("/supprimer/:id", (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;

  res.status(200).json({
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalQty: cart.totalQty
  });
});

router.get("/valider", (req, res, next) => {
  if (!req.session.cart) {
    return res.status(404).json({
      message: "produit introuvable dans le panier"
    });
  }
  var cart = new Cart(req.session.cart);
  res.status(200).json({ total: cart.totalPrice });
});

router.get("/commande", (req, res, next) => {
  Commandes.find({}, function(err, docs) {
    if (err) {
      res.status(500).json({ error: err });
    }
    var cart;
    // var productId = req.params.id;
    docs.forEach(function(doc) {
      console.log(doc);
      cart = new Cart(doc.cart);
      doc.cart.items = cart.generateArray();
      // console.log(doc.cart.items);
    });
    res.status(200).json({
      docs: docs
    });
  }).catch(err => {
    res.status(500).json({
      errorcommmande: err
    });
  });
});
router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "order Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
*/
module.exports = router;
