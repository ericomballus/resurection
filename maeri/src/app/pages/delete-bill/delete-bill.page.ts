import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GammeBeforeSalePage } from 'src/app/gamme/gamme-before-sale/gamme-before-sale.page';
import { Bill } from 'src/app/models/bill.model';
import { Panier } from 'src/app/models/panier.model';
import { Gamme } from 'src/app/models/gamme.model';
import { Product } from 'src/app/models/product.model';
import { AdminService } from 'src/app/services/admin.service';
import { GammeService } from 'src/app/services/gamme.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-bill',
  templateUrl: './delete-bill.page.html',
  styleUrls: ['./delete-bill.page.scss'],
})
export class DeleteBillPage implements OnInit {
  bill: Bill;
  products: any[] = [];
  productsRandom: any[] = [];
  toRemove: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  facture: Bill;
  randomObj = {};
  gammeList = {};
  toRemoveArr: any[] = [];
  productsRestant: Product[] = [];
  priceArr: number[] = [];
  desableBtn: boolean = false;
  constructor(
    private translateConfigService: TranslateConfigService,
    private saveRandom: SaverandomService,
    private gammeService: GammeService,
    private modalCrtl: ModalController,
    private notifi: NotificationService,
    private adminService: AdminService,
    private navCrtl: NavController,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.bill = this.saveRandom.getData();
    this.facture = this.saveRandom.getData();
    if (
      this.bill.partiallyCancel ||
      this.bill.purchaseOrder.length ||
      this.toRemoveArr.length
    ) {
      this.desableBtn = true;
    }
    //recupére tous les produits de la commande
    this.init();
  }
  init() {
    let objRandom = {};
    this.bill.commandes.forEach((elt) => {
      if (this.products.length) {
        this.products = [...this.products, ...elt.products];
      } else {
        this.products = elt.products;
      }
      if (this.bill.purchaseOrder.length) {
        this.bill.purchaseOrder.forEach((order) => {
          this.toRemoveArr.push(order['toRemove']);
          this.priceArr.push(order['price']);
        });
      }
    });
    let tab = JSON.parse(localStorage.getItem('voucherBill'));
    tab.commandes.forEach((elt) => {
      if (this.productsRandom.length) {
        this.productsRandom = [...this.productsRandom, ...elt.products];
      } else {
        this.productsRandom = elt.products;
      }
    });
    if (this.toRemoveArr.length) {
      this.desableBtn = true;
    }
    this.productsRandom.forEach((prod) => {
      this.toRemoveArr.forEach((arr) => {
        arr.forEach((com) => {
          if (prod.item._id == com.item._id) {
            prod['qty'] = prod['qty'] - com['qty'];
          }
        });
      });
    });
    console.log('best ==', this.productsRandom);
    localStorage.removeItem('productsRandom');
    localStorage.setItem('billProducts', JSON.stringify(this.products));
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  changeProdPrice(ev, row) {
    console.log(row);
  }
  addOne(row, i) {
    // cette action annule le retour du produit
    let prod: Product = row['item'];
    row['qty'] = row['qty'] + 1;
    if (row['removeQuantity']) {
      row['removeQuantity'] = row['removeQuantity'] - 1;
    } else {
      row['removeQuantity'] = 1;
    }
    row['price'] = row['price'] + row['item']['sellingPrice'];
    if (prod.productType == 'Gamme') {
      let data: Gamme = row['item'];
      data.productList.forEach((elt: Product) => {
        this.gammeRestore(elt);
      });
    } else {
      this.toRemove.forEach((product) => {
        if (product._id == row['item']['_id']) {
          product.quantityRandom = product.quantityRandom - 1;
        }
      });
      this.addInStorage(i);
    }
  }
  removeOne(row, index) {
    let avaible = this.productsRandom[index]['qty'];
    if (avaible == 0) {
      this.notifi.presentAlert(
        `impossible de poursuivre cette opération car le produit selectionné a deja été retourné dans le magasin`
      );
      return;
    } else {
      let prod: Product = row['item'];
      if (prod.productType == 'Gamme') {
        this.buyGamme(row.item, row, index);
      } else {
        row['qty'] = row['qty'] - 1;
        row['price'] = row['price'] - row['item']['sellingPrice'];
        if (row['removeQuantity']) {
          row['removeQuantity'] = row['removeQuantity'] + 1;
        } else {
          row['removeQuantity'] = 1;
        }

        // this.products[index] = row;
        let ind = this.toRemove.findIndex((prod) => {
          return prod._id == row.item._id;
        });
        if (ind >= 0) {
          this.toRemove[ind].quantityRandom =
            this.toRemove[ind].quantityRandom + 1;
        } else {
          row.item['quantityRandom'] = 1;
          this.toRemove.push(row.item);
        }
        this.removeInStorage(index);
      }
    }
  }

  removeFromChild(row, i) {
    let index = this.bill.refundVoucher.length - 1;
    console.log(this.bill.refundVoucher[index]);
    console.log(row);
  }

  async buyGamme(gamme: Gamme, row, index) {
    gamme.remove = true;
    gamme.quantityToSale = row['qty'];
    gamme.productList.forEach((elt) => {
      elt.toRemove = elt.toRemove * row['qty'];
    });
    this.gammeService.setGamme(gamme);
    const modal = await this.modalCrtl.create({
      component: GammeBeforeSalePage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      let reste = this.saveRandom.getProducListGamme();
      //console.log('le reste ici', reste);
      this.addProductListToGamme(index, reste);
      if (
        data.data &&
        data.data['removeToList'] &&
        data.data['removeToList'].length
      ) {
        row['qty'] = data.data['quantity'];
        this.removeInStorage(index);
        let tab: Product[] = data.data['removeToList'];
        tab.forEach((prod) => {
          this.ma(prod);
        });
      }
    });
    return await modal.present();
  }
  ma(product: Product) {
    let ind = this.toRemove.findIndex((prod) => {
      return prod._id == product._id;
    });
    if (ind >= 0) {
      this.toRemove[ind].quantityRandom =
        this.toRemove[ind].quantityRandom + product.toRemove;
    } else {
      product['quantityRandom'] = product.toRemove;
      this.toRemove.push(product);
    }
  }
  gammeRestore(prod: Product) {
    this.toRemove.forEach((product) => {
      if (product._id == prod['_id']) {
        if (product.quantityRandom) {
          product.quantityRandom = product.quantityRandom - 1;
        }
      }
    });
  }

  cancelBill() {
    if (this.toRemove.length == 0) {
    }
    this.toRemove.forEach((elt) => {
      elt['qty'] = elt['quantityRandom'];
      elt['quantityRandom'] = elt['quantityRandom'];
      elt['toRemove'] = elt['quantityRandom'];
      // elt['item'] = elt;
    });
    this.notifi
      .presentAlertConfirm('DELETE ORDER ?')
      .then((res) => {
        this.notifi.presentLoading();
        let productTab: Panier[] = []; //il contient l'ensemble des produits de la commande
        this.bill.invoiceCancel = true;

        this.bill.commandes.forEach((elt) => {
          if (productTab.length) {
            productTab = [...productTab, ...elt.products];
          } else {
            productTab = elt.products;
          }
        });

        let tab = []; //produits annulées sur la facture
        console.log(this.toRemove);

        let price = 0;
        this.toRemove.forEach((pro) => {
          price = price + pro.toRemove * pro.sellingPrice;
          tab.push({
            _id: pro._id,
            name: pro.name,
            productType: pro.productType,
            qty: pro.toRemove,
            toRemove: pro.toRemove,
            sellingPrice: pro.sellingPrice,
            totalPrice: pro.toRemove * pro.sellingPrice,
            item: {
              _id: pro._id,
              productType: pro.productType,
              qty: pro.toRemove,
              toRemove: pro.toRemove,
            },
          });
        });

        let resteProduits = JSON.parse(localStorage.getItem('billProducts')); // reste de produit sur la facture
        if (!resteProduits) {
          resteProduits = null;
        }

        this.adminService
          .cancelOrder(
            this.bill.localId,
            productTab,
            this.facture,
            tab,
            price,
            resteProduits
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            console.log('cancel bill ok ====ligne 294');
            localStorage.removeItem('billProducts');
            this.notifi.dismissLoading();
            this.navCrtl.back();
          });
        //  }
      })
      .catch((err) => {
        this.toRemove = [];
        //  this.facture['cancel'] = true;
        this.bill = this.facture;
        this.navCrtl.back();
        // this.desableBtn= false
      });
  }
  modificationPrecedente() {
    this.bill.purchaseOrder.forEach((elt) => {});
  }
  createRefundVoucher() {
    let tab = [];
    let newGamme = this.gammeService.getGamme();
    let oldGamme: Gamme = JSON.parse(localStorage.getItem('oldGamme'));
    this.gammeList[oldGamme._id] = { oldGamme, newGamme };
  }
  removeInStorage(index) {
    let tab: Panier[] = JSON.parse(localStorage.getItem('billProducts'));
    let panier = tab[index];
    panier.qty = panier.qty - 1;
    panier.price = panier.qty * panier.item.sellingPrice;
    tab.splice(index, 1, panier);
    localStorage.setItem('billProducts', JSON.stringify(tab));
  }
  addInStorage(index) {
    let tab: Panier[] = JSON.parse(localStorage.getItem('billProducts'));
    let panier = tab[index];
    panier.qty = panier.qty + 1;
    panier.price = panier.qty * panier.item.sellingPrice;
    tab.splice(index, 1, panier);
    localStorage.setItem('billProducts', JSON.stringify(tab));
  }
  addProductListToGamme(index, arr) {
    let tab: Panier[] = JSON.parse(localStorage.getItem('billProducts'));
    let panier = tab[index];
    panier.item['productList'] = arr;
    tab.splice(index, 1, panier);
    localStorage.setItem('billProducts', JSON.stringify(tab));
  }
  AnnulerFacture() {
    this.notifi.presentLoading();
    this.toRemove = [];
    this.facture.commandes.forEach((com: any) => {
      this.toRemove = [...this.toRemove, ...com.products];
    });

    this.facture['cancel'] = true;
    this.adminService
      .cancelOrder2(this.facture.localId, this.toRemove, this.facture)
      .subscribe((res) => {
        console.log('suppression ok', res);
        this.notifi.dismissLoading();
        this.navCrtl.back();
      });
    /* setTimeout(() => {
      this.notifi.dismissLoading();
      this.cancelBill();
    }, 1200);*/
  }
}
