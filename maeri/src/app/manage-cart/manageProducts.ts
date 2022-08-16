export class Productmanager {
  quantityStore: any;
  quantityItems: any;
  nonglace: any;
  glace: any;
  copyProd: any;
  modeNG: any;
  modeG: any;
  CA: any;
  cassierStore: any;
  resourceList: any;
  BTL: any;
  btlsStore: any;
  constructor(Prod) {
    this.quantityItems = Prod.quantityItems || 0;
    this.quantityStore = Prod.quantityStore || 0;
    this.nonglace = Prod.nonglace || 0;
    this.modeNG = Prod.modeNG || 0;
    this.modeG = Prod.modeG || 0;
    this.glace = Prod.glace || 0;
    this.resourceList = Prod.resourceList || [];
    this.CA = Prod.CA || 0;
    this.cassierStore = Prod.cassierStore || 0;
    this.BTL = Prod.BTL || 0;
    this.btlsStore = Prod.btlsStore || 0;
  }

  add(mod) {
    console.log(this);

    if (mod == 'NG') {
      if (this.resourceList.length) {
        this.modeNG++;
        return this;
      } else if (this.quantityStore) {
        this.modeNG++;
        this.quantityStore = this.quantityStore - 1;
        return this;
      } else {
        return;
      }
    } else if (mod == 'G') {
      if (this.resourceList.length) {
        this.modeG++;
        return this;
      } else if (this.glace) {
        this.modeG++;
        this.glace = this.glace - 1;
        this.quantityStore = this.quantityStore - 1;
        return this;
      } else {
        return;
      }
    } else if (mod == 'CA') {
      if (this.resourceList.length) {
        this.CA++;
        return this;
      } else if (this.cassierStore) {
        this.CA++;
        this.cassierStore = this.cassierStore - 1;
        // this.quantityStore = this.quantityStore - 1;
        return this;
      } else {
        return;
      }
    } else if (mod == 'BTL') {
      if (this.resourceList.length) {
        this.BTL++;
        return this;
      } else if (this.btlsStore) {
        this.BTL++;
        this.btlsStore = this.btlsStore - 1;
        // this.quantityStore = this.quantityStore - 1;
        return this;
      } else {
        return;
      }
    }
  }

  reduceByOne(id) {}

  removeItem(id) {
    //console.log("total", this.totalPrice);
  }
}
