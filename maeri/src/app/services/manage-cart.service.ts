import { Injectable } from '@angular/core';
import { Cart } from '../manage-cart/manageCart';

@Injectable({
  providedIn: 'root',
})
export class ManageCartService {
  constructor() {}

  addToCart(data) {
    if (data.sc) {
      var cart = new Cart({});
      cart.addFromSc(data, data._id, data.value); //
      return cart;
    } else if (data.cart) {
      if (data['product'] && data['product']['sc']) {
        let qty = data['product']['value'];
        const panier = data.cart;
        // console.log('la value ici===>', panier);
        var cart = new Cart(panier);
        // console.log('cart here ici===>', cart);
        // return;
        // console.log('la value ici===>', qty);
        cart.addFromSc(data['product'], data['product']['_id'], qty);
        return cart;
      } else if (data['product']['removeQuantity'] >= 0) {
        let qty = data['product']['removeQuantity'];
        const panier = data.cart;
        var cart = new Cart(panier);
        cart.addMoreOne(data['product'], data['product']['_id'], qty);
        return cart;
      } else {
        const panier = data.cart;
        var cart = new Cart(panier);
        cart.add(data['product'], data['product']['_id']);
        return cart;
      }
    } else {
      if (data['removeQuantity'] >= 0) {
        let qty = data['removeQuantity'];
        var cart = new Cart({});
        cart.addMoreOne(data, data._id, qty); //
        return cart;
      } else {
        var cart = new Cart({});
        cart.add(data, data._id); //addMoreOne
        return cart;
      }
    }
  }

  addOneSpecific(data, randomId) {
    const panier = data.cart;
    var cart = new Cart(panier);
    data.orientationBTL == 'BTL';
    cart.add(data, randomId);
    return cart;
  }

  addOneCaToCart(id, data) {
    let newCart = {};
    var cart = new Cart(data);
    cart.addByOneCa(id);
    if (cart['items'][id]['qty'] == 0) {
      delete cart['items'][id];
    }
    newCart = {
      cart: cart,
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    };

    return newCart;
  }

  removeOneToCart(id, data, randomId?) {
    let newCart = {};
    var cart = new Cart(data);
    // console.log(cart);
    if (randomId) {
      cart.reduceBySpecific(randomId);
      if (cart['items'][randomId]['qty'] == 0) {
        delete cart['items'][randomId];
      }
      newCart = {
        cart: cart,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
      };
    } else {
      cart.reduceByOne(id);
      if (cart['items'][id]['qty'] == 0) {
        delete cart['items'][id];
      }
      newCart = {
        cart: cart,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
      };
    }

    return newCart;
  }

  removeOneCaToCart(id, data) {
    console.log(data);
    let newCart = {};
    var cart = new Cart(data);
    // console.log(cart);
    // remove cassier
    cart.reduceByOneCa(id);
    if (cart['items'][id]['qty'] == 0) {
      delete cart['items'][id];
    }
    newCart = {
      cart: cart,
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    };

    return newCart;
  }

  removeOnePackToCart(id, data) {
    console.log(data);
    if (data['cart']['cart']) {
      var cart = new Cart(data['cart']['cart']);
      console.log(cart);

      cart.reduceByOne(id);

      const newCart = {
        cart: cart,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
      };
      return newCart;
    } else {
      var cart = new Cart(data['cart']);
      console.log(cart);

      cart.reduceByOne(id);

      const newCart = {
        cart: cart,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
      };
      return newCart;
    }
  }

  removeOneToCart2(id, data, randomId?) {
    console.log(data);

    var cart = new Cart(data);
    console.log(cart);
    if (randomId) {
      cart.reduceByOne(randomId);
    } else {
      cart.reduceByOne(id);
    }

    const newCart = {
      items: cart.items,
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    };
    return newCart;
  }

  removeOneAllToCart(id, data) {
    var cart = new Cart(data);
    cart.removeItem(id);
    let newCart = {
      cart: cart,
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    };
    //console.log(newCart);
    return newCart;
  }

  addNewPrice(data, newPrice, id) {
    const panier = data.cart;
    var cart = new Cart(panier);
    cart.changePrice(data, id, newPrice);
    return cart;
  }
}
