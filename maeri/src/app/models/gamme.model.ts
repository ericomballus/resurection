import { Product } from './product.model';

export class Gamme {
  sellingPrice: number;
  name: string;
  productList: Product[];
  productListFound: Product[];
  removeProductList: Product[] = [];
  addProductList: Product[] = [];
  _id = '';
  adminId: string;
  created: any;
  desabled = false;
  nbr = 0;
  quantityToSale = 1;
  productType = 'Gamme';
  url = ' ';
  originalname = '';
  filename = '';
  newUrl = '';
  remove: boolean = false;
  storeId: string;
  nbrRandom = 0;
  constructor(name, productList, sellingPrice, id, created?) {
    this.name = name;
    this.productList = productList;
    this.sellingPrice = sellingPrice;
    this._id = id;
    this.adminId = localStorage.getItem('adminId');
    if (created) {
      this.created = created;
    } else {
      this.created = Date.now();
    }
  }

  addToProductList(data: Product) {
    let found = this.productList.find((prod) => {
      return prod._id == data._id;
    });
    if (found) {
      console.log('existe deja');
    } else {
      this.productList.push(data);
      console.log('resultat==>', this.productList);
    }
  }

  removeToProductList(data, nbr?) {
    this.productList = this.productList.filter((prod) => {
      return prod._id !== data._id;
    });
  }
  getProductList() {
    return this.productList;
  }
}
