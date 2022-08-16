class Cart {
  constructor(Cart) {
    this.items = Cart.items || {};
    this.totalQty = Cart.totalQty || 0;
    this.totalPrice = Cart.totalPrice || 0;
  }

  add(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    storedItem.qty++;
    storedItem.price = storedItem.item.sellingPrice * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.sellingPrice;
  }

  reduceByOne(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.sellingPrice;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.sellingPrice;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  }

  removeItem(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].sellingPrice;
    delete this.items[id];
  }

  generateArray() {
    const arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
}

module.exports = Cart;
