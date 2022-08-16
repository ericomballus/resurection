export class Cart {
  items: any;
  totalQty: any;
  totalPrice: any;
  totalPriceRandom: any;
  randomSellingPrice: any;
  constructor(Cart) {
    this.items = Cart.items || {};
    this.totalQty = Cart.totalQty || 0;
    this.totalPrice = Cart.totalPrice || 0;
    this.totalPriceRandom = Cart.totalPriceRandom || 0;
    this.randomSellingPrice = 0;
  }

  add(item, id) {
    this.randomSellingPrice = item.sellingPrice;
    if (item.orientationBTL && item.orientationBTL == 'BTL') {
      // id = id + 'BTL' + id;
    }

    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    if (item.sellingPrice) {
      //
      if (
        localStorage.getItem('saleAsPack') &&
        localStorage.getItem('saleAsPack') == 'true'
      ) {
        if (item['orientationCA'] == 'CA') {
          // je vend le cassier
          storedItem.qty++;
          if (storedItem.item.sellingPackPrice) {
            storedItem.price =
              storedItem.item.sellingPackPrice * storedItem.item.CA +
              storedItem.item.sellingPrice * storedItem.item.BTL;
            this.totalPrice += storedItem.item.sellingPackPrice;
            this.totalPriceRandom = this.totalPrice;
          }
        } else if (item['orientationBTL']) {
          storedItem.qty++;
          storedItem.price =
            storedItem.item.sellingPackPrice * storedItem.item.CA +
            storedItem.item.sellingPrice * storedItem.item.BTL;
          this.totalPrice += storedItem.item.sellingPrice;
          this.totalPriceRandom = this.totalPrice;
        } else {
          storedItem.qty++;
          storedItem.price = storedItem.item.sellingPrice * storedItem.qty;
          this.totalPrice += storedItem.item.sellingPrice;
          this.totalPriceRandom = this.totalPrice;
        }
      } else {
        storedItem.qty++;
        if (storedItem.item.modeG) {
          storedItem.price =
            storedItem.item.sellingPrice * storedItem.item.modeG;
        } else if (storedItem.item.modeNG) {
          storedItem.price =
            storedItem.item.sellingPrice * storedItem.item.modeNG;
        } else {
          storedItem.price = storedItem.item.sellingPrice * storedItem.qty;
        }

        this.totalPrice += storedItem.item.sellingPrice;
        this.totalPriceRandom = this.totalPrice;
      }

      this.totalQty++;

      //
    } else {
      // le produit n'a pas de prox de vente
      if (
        localStorage.getItem('saleAsPack') &&
        localStorage.getItem('saleAsPack') == 'true'
      ) {
        //depot
        if (item['orientationCA'] == 'CA') {
          // je vend le cassier
          storedItem.qty++;
          if (storedItem.item.sellingPackPrice) {
            storedItem.price = storedItem.item.sellingPackPrice;
          }

          this.totalPrice += storedItem.item.sellingPackPrice;
          this.totalPriceRandom = this.totalPrice;
        } else {
          if (storedItem.item.BtlSale) {
            storedItem.item.BtlSale++;
          } else {
            storedItem.item.BtlSale = 1;
          }
          storedItem.price =
            storedItem.item.purchasingPrice * storedItem.item.BtlSale;
          this.totalPrice += storedItem.item.purchasingPrice;
          this.totalPriceRandom = this.totalPrice;
        }
      } else {
        storedItem.qty++;
        storedItem.price = storedItem.item.purchasingPrice * storedItem.qty;

        this.totalPrice += storedItem.item.purchasingPrice;
        this.totalPriceRandom = this.totalPrice;
      }
      this.totalQty++;
      //

      //
    }
  }

  addMoreOne(item, id, numb) {
    console.log(item);

    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    if (item.purchasingPrice >= 0) {
      storedItem.qty = parseInt(numb);
      storedItem.price = storedItem.item.purchasingPrice * parseInt(numb);
      this.totalQty = this.totalQty + parseInt(numb);
      this.totalPrice =
        this.totalPrice + storedItem.item.purchasingPrice * parseInt(numb);
      this.totalPriceRandom = this.totalPrice;
    } else if (item['product'].purchasingPrice) {
      storedItem.qty = parseInt(numb);
      storedItem.price =
        storedItem.item['product'].purchasingPrice * parseInt(numb);
      this.totalQty = this.totalQty + parseInt(numb);
      this.totalPrice =
        this.totalPrice +
        storedItem.item['product'].purchasingPrice * parseInt(numb);
      this.totalPriceRandom = this.totalPrice;
    } else {
      storedItem.qty = parseInt(numb);
      storedItem.price = storedItem.item.purchasingPrice * parseInt(numb);
      this.totalQty = this.totalQty + parseInt(numb);
      this.totalPrice =
        this.totalPrice + storedItem.item.purchasingPrice * parseInt(numb);
      this.totalPriceRandom = this.totalPrice;
    }
  }

  addByOneCa(id) {
    if (this.items[id].qty === 0) {
      this.items[id].qty = 1;
      this.totalQty = this.totalQty + 1;
      this.items[id].price = 0;
      this.totalPrice = this.totalPrice + this.items[id].item.sellingPackPrice;
      this.totalPriceRandom = this.totalPrice;
      return;
    } else {
      this.items[id].qty++;
      this.items[id].item.qty++;
    }
    if (this.items[id].item.sellingPackPrice) {
      this.items[id].price =
        this.items[id].price + this.items[id].item.sellingPackPrice;
      this.totalQty++;
      this.totalPrice = this.totalPrice + this.items[id].item.sellingPackPrice;
      this.totalPriceRandom = this.totalPrice;
    } else {
      alert('please provide selling pack price');
      return;
    }
  }

  addFromSc(item, id, numb) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    if (numb > 0) {
      this.totalQty = this.totalQty - storedItem.qty;
      this.totalPrice = this.totalPrice - storedItem.price;
      storedItem.qty = numb;
      storedItem.price = storedItem.item.sellingPrice * numb;
      this.totalQty = this.totalQty + numb;
      this.totalPrice = this.totalPrice + storedItem.price;
    } else {
      this.totalQty = this.totalQty - this.items[id]['qty'];
      this.totalPrice = this.totalPrice - this.items[id]['price'];
      delete this.items[id];
    }
  }

  reduceByOne(id) {
    if (this.items[id].qty === 0) {
      this.items[id].qty = 0;
      this.totalQty = this.totalQty;
      this.items[id].price = 0;
      this.totalPrice = this.totalPrice;
      this.totalPriceRandom = this.totalPrice;
      return;
    } else {
      this.items[id].qty--;
      this.items[id].item.qty--;
    }
    if (this.items[id].item.sellingPrice) {
      this.items[id].price -= this.items[id].item.sellingPrice;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.sellingPrice;
      this.totalPriceRandom = this.totalPrice;
    } else {
      this.items[id].price -= this.items[id].item.sellingPrice;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.sellingPrice;
      this.totalPriceRandom = this.totalPrice;
    }

    if (this.items[id].qty <= 0) {
      //delete this.items[id];
    }
  }

  reduceBySpecific(id) {
    if (this.items[id].qty === 0) {
      this.items[id].qty = 0;
      this.totalQty = this.totalQty;
      this.items[id].price = 0;
      this.totalPrice = this.totalPrice;
      this.totalPriceRandom = this.totalPrice;
      return;
    } else {
      this.items[id].qty--;
      this.items[id].item.qty--;
    }
    if (this.items[id].item.sellingPrice) {
      this.items[id].price -= this.items[id].item.sellingPrice;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.sellingPrice;
      this.totalPriceRandom = this.totalPrice;
    } else {
      this.items[id].price -= this.items[id].item.sellingPrice;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.sellingPrice;
      this.totalPriceRandom = this.totalPrice;
    }
  }

  reduceByOneCa(id) {
    if (this.items[id].qty === 0) {
      this.items[id].qty = 0;
      this.totalQty = this.totalQty;
      this.items[id].price = 0;
      this.totalPrice = this.totalPrice;
      this.totalPriceRandom = this.totalPrice;
      return;
    } else {
      this.items[id].qty--;
      this.items[id].item.qty--;
    }
    if (this.items[id].item.sellingPackPrice) {
      this.items[id].price -= this.items[id].item.sellingPackPrice;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.sellingPackPrice;
      this.totalPriceRandom = this.totalPrice;
    } else {
      alert('please provide selling pack price');
      return;
    }
  }

  removeItem(id) {
    //console.log("total", this.totalPrice);
    // console.log("total", this.items[id]);
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price * this.items[id].qty;
    this.totalPriceRandom = this.totalPrice;
    delete this.items[id];
  }

  generateArray() {
    const arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  generateArrayManagerMode(items) {
    const arr = [];
    for (var id in items) {
      arr.push(items[id]);
    }
    return arr;
  }

  changePrice(item, id, newPrice) {
    this.totalPrice = 0;
    var storedItem = this.items[id];
    for (const key in this.items) {
      this.totalPrice = this.totalPrice + this.items[key].price;
    }
    let sellingPrice = 0;
    let Total = 0;
    if (item.product.item && item.product.item.CA) {
      sellingPrice = item.product.item.sellingPackPrice;
      Total = item.product.item.CA;
    } else if (item.product.item && item.product.item.BTL) {
      sellingPrice = item.product.item.sellingPrice;
      Total = item.product.item.BTL;
    } else {
      sellingPrice = item.product.item.sellingPrice;
      Total = storedItem.qty;
    }
    if (item.product.item && item.product.item.sellingPriceRandom) {
      item.product.item.sellingPrice = item.product.item.sellingPriceRandom;
    }

    let oldTotal = sellingPrice * Total;
    storedItem.price = newPrice * Total;
    // this.totalPrice = this.totalPrice - oldTotal;
    // this.totalPrice = this.totalPrice + newPrice * Total;
    item.product.item['sellingPriceRandom'] = item.product.item.sellingPrice;
    item.product.item.sellingPrice = newPrice;
    this.totalPrice = 0;
    for (const key in this.items) {
      this.totalPrice = this.totalPrice + this.items[key].price;
    }
  }
}
