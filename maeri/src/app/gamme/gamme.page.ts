import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Gamme } from '../models/gamme.model';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { GammeService } from '../services/gamme.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ManagesocketService } from '../services/managesocket.service';
import { NotificationService } from '../services/notification.service';
import { RestApiService } from '../services/rest-api.service';
import { SaverandomService } from '../services/saverandom.service';
import { TranslateConfigService } from '../translate-config.service';
import { GammeUpdatePage } from './gamme-update/gamme-update.page';

@Component({
  selector: 'app-gamme',
  templateUrl: './gamme.page.html',
  styleUrls: ['./gamme.page.scss'],
})
export class GammePage implements OnInit {
  gammeList: Gamme[] = [];
  storeList: Store[] = [];
  desactive = true;
  multiStoreGamme = [];
  randomObj = {};
  products: Product[] = [];
  selectedLanguage: string;
  constructor(
    private gammeService: GammeService,
    private router: Router,
    private modalController: ModalController,
    private resApi: RestApiService,
    private manageSocket: ManagesocketService,
    private notifi: NotificationService,
    private saveRandom: SaverandomService,
    public getStoreName: GetStoreNameService,
    private translateConfigService: TranslateConfigService
  ) {}

  ngOnInit() {
    this.takeGammeList();
    this.takeBillardList();
    this.webServerSocket();
    this.storeList = this.saveRandom.getStoreList();

    let adminAccount = JSON.parse(localStorage.getItem('user'))[0];
    // return adminAccount['storeId'];
    this.storeList = adminAccount['storeId'];
    console.log(this.storeList);
  }
  ionViewWillEnter() {}
  webServerSocket() {
    let id = localStorage.getItem('adminId');
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}newGamme`, (data) => {
        this.gammeList.push(data);
      });
      sockets.on(`${id}gammeUpdate`, (data) => {
        let index = this.gammeList.findIndex((prod) => {
          return prod._id == data._id;
        });
        if (index >= 0) {
          this.gammeList.splice(index, 1, data);
        }
      });
    });
  }
  addGamme() {
    this.router.navigateByUrl('gamme/gamme-add');
  }

  takeGammeList() {
    this.gammeService.getGammeList().subscribe((data: any) => {
      console.log(data);

      this.gammeList = data;
      this.rangeProductByStore();
    });
  }
  takeBillardList() {
    this.resApi.getBillardList().subscribe((data: any) => {
      this.gammeService.setProducts(data['product']);
    });
  }
  async updateGamme(gamme) {
    this.gammeService.setGamme(gamme);
    const modal = await this.modalController.create({
      component: GammeUpdatePage,
      componentProps: {},
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data['cancel'] == true) {
        gamme = this.gammeService.getGamme();
        console.log(gamme);
        let index = this.gammeList.findIndex((prod) => {
          return prod._id == gamme._id;
        });

        if (index >= 0) {
          this.gammeList.splice(index, 1, gamme);
          this.rangeProductByStore();
        }
      }
    });
    return await modal.present();
  }
  deleteGamme(gamme: Gamme) {
    this.notifi.dismissLoading();
    this.gammeService.deleteOneGamme(gamme).subscribe((data) => {
      this.notifi.dismissLoading();
      this.notifi.presentToast('succesffuly', 'primary');
      this.gammeList = this.gammeList.filter((prod) => {
        return prod._id != gamme._id;
      });
      this.rangeProductByStore();
    });
  }
  addToAllStore() {
    this.notifi.presentLoading();
    let tab = [];
    console.log(this.storeList);
    this.storeList.forEach((store) => {
      this.gammeList.forEach((prod) => {
        if (prod.storeId !== store.id) {
          prod.storeId = store.id;
          this.buildGamme(prod, store);
        }
      });
    });
    this.notifi.dismissLoading();
    setTimeout(() => {
      this.takeGammeList();
    }, 3000);
    //this.restApi.transferBillardGame(formData).subscribe((data) => {});
  }

  TransferOne(gamme: Gamme) {
    this.storeList.forEach((store) => {
      if (store.id == gamme.storeId) {
      } else {
        this.buildGamme(gamme, store);
      }
    });
  }

  async buildGamme(product: Gamme, store: Store) {
    this.notifi.presentLoading();
    let productList: Product[] = [];
    if (product.filename.length == 0) {
      product.filename = `${new Date().getTime()}`;
      product.originalname = `${new Date().getTime()}`;
    }
    try {
      productList = await this.findProductLIst(product.productList, store);
      if (productList.length == product.productList.length) {
        let prod = {
          adminId: product.adminId,
          name: product.name,
          sellingPrice: product.sellingPrice,
          storeId: store.id,
          url: product.url,
          filename: product.filename,
          originalname: product.originalname,
          productList: productList,
        };

        this.gammeService.transfertGamme(prod).subscribe((data) => {
          this.notifi.presentToast('gamme created !', 'primary');
          this.notifi.dismissLoading();
          setTimeout(() => {
            this.takeGammeList();
          }, 3000);
        });
      }
    } catch (error) {
      this.notifi.dismissLoading();
      this.notifi.presentToast('some error found please try against', 'danger');
    }
  }

  rangeProductByStore() {
    let group = this.gammeList.reduce((r, a) => {
      r[a.storeId] = [...(r[a.storeId] || []), a];
      return r;
    }, {});
    this.multiStoreGamme = [];

    this.randomObj = group;
    for (const property in group) {
      this.multiStoreGamme.push(group[property]);
    }
    if (this.multiStoreGamme.length > 1) {
      this.desactive = false;
    }
    this.multiStoreGamme.forEach(async (arr) => {
      let name = await this.getStoreName.takeName(arr);
      arr['storeName'] = name;
    });
  }

  addToStore(gamme) {
    gamme['open'] = true;
    console.log(gamme);
  }
  selectStore(store, gamme) {
    gamme['open'] = false;
    console.log(store);
  }

  findProductLIst(arr: Product[], store: Store): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      let tab: Product[] = [];
      this.products = this.gammeService.getProducts();

      arr.forEach(async (pro) => {
        try {
          let prod = await this.chercherProduit(pro);
          tab.push(prod);
          if (tab.length == arr.length) {
            resolve(tab);
          }
        } catch (error) {
          let produit: Product = await this.buildProduct(pro, store);
          tab.push(produit);
          if (tab.length == arr.length) {
            resolve(tab);
          }
        }
      });
    });
  }

  chercherProduit(pro: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.products = this.gammeService.getProducts();
      let produit = this.products.find((prod) => {
        prod.storeId == pro.storeId &&
          prod.filename == pro.filename &&
          prod.categoryId == pro.categoryId &&
          prod.desabled == false;
      });
      if (produit) {
        resolve(produit);
      } else {
        reject(false);
      }
    });
  }

  buildProduct(product: Product, store: Store): Promise<Product> {
    return new Promise((resolve, reject) => {
      let prod = {
        adminId: product.adminId,
        name: product.name,
        sellingPrice: product.sellingPrice,
        purchasingPrice: product.purchasingPrice,
        categoryName: product.categoryName,
        categoryId: product.categoryId,
        superCategory: product.superCategory,
        storeId: store.id,
        url: product.url,
        filename: product.filename,
        originalname: product.originalname,
      };
      this.resApi.transferBillardGame(prod).subscribe(
        (data) => {
          console.log('result', data);
          resolve(data['data']);
        },
        (err) => {
          console.log(err);
          reject(false);
        }
      );
    });
  }
}
