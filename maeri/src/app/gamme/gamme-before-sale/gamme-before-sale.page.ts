import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Gamme } from 'src/app/models/gamme.model';
import { Product } from 'src/app/models/product.model';
import { GammeService } from 'src/app/services/gamme.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ProductForGammePage } from '../product-for-gamme/product-for-gamme.page';

@Component({
  selector: 'app-gamme-before-sale',
  templateUrl: './gamme-before-sale.page.html',
  styleUrls: ['./gamme-before-sale.page.scss'],
})
export class GammeBeforeSalePage implements OnInit {
  Products: any;
  gamme: Gamme;
  removeProductList: Product[] = [];
  remainingProductList: Product[] = [];
  oldObj: Gamme;
  removeToList: boolean = false;
  objRandom = {};
  constructor(
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private notifi: NotificationService,
    private gammeService: GammeService,
    private randomStorage: SaverandomService
  ) {}

  ngOnInit() {
    let obj = this.gammeService.getGamme();

    if (obj.remove) {
      this.removeToList = true; //check si on doit gerer le retour des produits
      obj.productList.forEach((prod) => {
        //j'initialise objet random
        let id = prod._id;
        this.objRandom[id] = prod;
      });
    }
    this.gamme = new Gamme(
      obj.name,
      obj.productList,
      obj.sellingPrice,
      obj._id,
      obj.created
    );
    if (obj['qty']) {
      this.gamme.quantityToSale = obj['qty'];
    }

    localStorage.setItem('oldGamme', JSON.stringify(obj));
  }

  saveToCart() {
    this.generateArray();
    this.gamme.removeProductList = this.gammeService.getRemoveProductList();
    this.gamme.addProductList = this.gammeService.getaddProductList();
    this.modalController.dismiss({
      add: true,
      quantity: this.gamme.quantityToSale,
      removeToList: this.removeProductList, //produit retour
      reste: this.remainingProductList,
      prix: this.gamme.sellingPrice,
      gamme: this.gamme,
    });
  }

  closeModal() {
    localStorage.removeItem('oldGamme');
    this.modalController.dismiss({
      cancel: true,
    });
  }

  async pickResource() {
    this.gammeService.setGamme(this.gamme);

    const modal = await this.modalController.create({
      component: ProductForGammePage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data['cancel'] == true) {
        this.gamme.productList = [];
        this.gamme.productList = JSON.parse(localStorage.getItem('oldGamme'))[
          'productList'
        ];
        this.gammeService.setGamme(this.gamme);
      } else {
        this.gamme = this.gammeService.getGamme();
        console.log(this.gamme);
      }
    });
    return await modal.present();
  }
  remove(prod: Product) {
    this.gamme.removeToProductList(prod);
    if (this.removeToList) {
      this.removeProductList.push(prod); //produit retour
    }
    this.gammeService.saveToRemoveList(prod);
    this.remainingProductList = this.gamme.getProductList();
    console.log('ce qui reste est===>', this.remainingProductList);
    let products: Product[] = JSON.parse(
      localStorage.getItem('oldGamme')
    ).productList;
    if (products.length - this.remainingProductList.length >= 2) {
      let price = 0;
      this.remainingProductList.forEach((p) => {
        price = price + p.sellingPrice;
      });
      this.gamme.sellingPrice = price;
    }
  }
  //gestion retour des produits
  removeQuantity(ev, prod, i) {
    let nbr = parseInt(ev.detail.value);
    let product = this.gamme.productList[i];

    if (Number.isNaN(nbr)) {
      let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
      let qty = oldGamme.productList[i].toRemove;
      this.gamme.productList[i].toRemove = qty; //je renitialise le produit
      if (this.removeProductList.length) {
        this.removeProductList = this.removeProductList.filter((prod) => {
          return prod._id !== product._id;
        });
      }
      this.checkGammeQuantity();
      this.removeToObjRandom(i);
    } else if (nbr <= this.gamme.quantityToSale) {
      this.gamme.productList[i].toRemove = nbr;

      if (this.removeProductList.length) {
        this.removeProductList = this.removeProductList.filter((prod) => {
          return prod._id !== product._id;
        });
        this.removeProductList.push(product);
        this.checkGammeQuantity();
      } else {
        this.removeProductList.push(product);
        this.checkGammeQuantity();
      }
      this.manageGammeUtils(i, nbr);
    } else if (nbr > this.gamme.productList[i].toRemove) {
      this.notifi.presentAlert(
        `incorrect value, value is greather than ${this.gamme.productList[i].toRemove}`
      );
      if (this.removeProductList.length) {
        this.removeProductList = this.removeProductList.filter((prod) => {
          return prod._id !== product._id;
        });
      }
      this.checkGammeQuantity();
      this.removeToObjRandom(i);
    } else {
      this.checkGammeQuantity();
    }
  }

  //
  checkGammeQuantity() {
    let check = [];

    if (this.removeProductList.length === this.gamme.productList.length) {
      this.removeProductList.forEach((prod) => {
        check.push(prod.toRemove);
      });
      let v = this.allEqual(check);
      if (v) {
        this.gamme.quantityToSale =
          this.gamme.quantityToSale - this.removeProductList[0].toRemove;
      } else {
        let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
        this.gamme.quantityToSale = oldGamme.quantityToSale;
      }
    } else {
      let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
      this.gamme.quantityToSale = oldGamme.quantityToSale;
    }
    this.gammeService.setGamme(this.gamme);
  }
  allEqual = (arr: number[]) => arr.every((v) => v === arr[0]);

  manageGammeUtils(index: number, remove: number) {
    let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
    let product = oldGamme.productList[index];
    product.toRemove = product.toRemove - remove;
    let id = product._id;
    this.objRandom[id] = product;
    console.log(this.objRandom);
  }

  removeToObjRandom(index) {
    let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
    let product = oldGamme.productList[index];
    delete this.objRandom[product._id];
    console.log(this.objRandom);
  }

  generateArray() {
    const arr: Product[] = [];
    for (var id in this.objRandom) {
      arr.push(this.objRandom[id]);
    }
    this.randomStorage.setProducListGamme(arr);
  }
}
