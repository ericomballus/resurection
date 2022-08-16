import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RestApiService } from '../services/rest-api.service';
import { WarehouseService } from '../services/warehouse.service';
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
  IonInput,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../services/admin.service';
import io from 'socket.io-client';
import { UrlService } from '../services/url.service';
import { Productmanager } from '../manage-cart/manageProducts';
import { ManageCartService } from '../services/manage-cart.service';
import { CountItemsService } from '../services/count-items.service';
import { Platform } from '@ionic/angular';
import { NotificationService } from '../services/notification.service';
import { makeBindingParser } from '@angular/compiler';
import { ManagerInventoryService } from '../services/manager-inventory.service';
import { SaverandomService } from '../services/saverandom.service';
import { Product } from '../models/product.model';
import { Location } from '@angular/common';
import { FichepointageService } from '../services/fichepointage.service';
@Component({
  selector: 'app-before-inventory',
  templateUrl: './before-inventory.page.html',
  styleUrls: ['./before-inventory.page.scss'],
})
export class BeforeInventoryPage implements OnInit {
  @ViewChild('nbrCassier', { read: ElementRef }) nbrCassier: ElementRef;
  @ViewChild('nbrBtl', { read: ElementRef }) nbrBtl: ElementRef;
  @ViewChildren(IonInput) inputs: IonInput[];
  public sockets;
  allCart: any;
  commande: boolean = false;
  resourceTab = [];
  public url;
  productsItem: any;
  productsItemRandom: any;
  productResto: any;
  adminId: any;
  tabRoles = [];
  num: Number = 2;
  btnProducts = true;
  btnResto = false;
  btnService = false;
  userName: any;
  stock_min: Number;
  pet: any;
  openCashDate: any;
  openCashDateId: any;
  ip: string;
  lat: any = 0;
  lng: any = 0;
  viewMode = 'invoices';
  products: any;
  products2: any;
  cartValue: any;
  shopAutorisation: boolean = false;
  totalItems = 0;
  desktopTab = [];
  transaction = [];
  cashOpened: Boolean;
  casgData: any;
  tables: any;
  tab = [];
  plat = [];
  invoices: any;
  isLoading = false;
  cashClose = 0;
  manageStockWithService: Boolean = false;
  //totalOut = 0;
  totalSale = 0;
  resultValue = 0;
  perte = 0;
  resultValueFake = true;
  openCash = 0;
  //@ViewChild('totalOut')totalOut: any
  totalOut = 0;
  randomObj = {};
  inventoryObj = {};
  quantityIn = {};
  quantityOut = {};
  resourceOut = {};
  resourceIn = {};
  texte = 'please wait we are building your inventory...';
  numb = 1;
  cart: any;
  eventsInventory: any;
  allAdd = 0;
  allOut = 0;
  lastInventory = [];
  lastInventoryObject = {};
  listStart = [];
  listStartObject = {};

  storeTypes: string[] = [];
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private socket: Socket,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private warehouseService: WarehouseService,
    public warehouService: WarehouseService,
    public translate: TranslateService,
    public adminService: AdminService,
    public urlService: UrlService,
    // public manageCartService: ManageCartService,
    public countItemsService: CountItemsService,
    private notification: NotificationService,
    private managerService: ManagerInventoryService,
    private randomStorage: SaverandomService,
    private location: Location,
    private ficheService: FichepointageService
  ) {
    this.languageChanged();
  }

  ngOnInit() {
    console.log(this.router.getCurrentNavigation());
    let setting = this.randomStorage.getSetting();
    this.storeTypes = this.randomStorage.getAdminAccount().storeType;
    if (this.storeTypes.length == 1 && this.storeTypes.includes('services')) {
      this.btnService = true;
    }
    this.manageStockWithService = setting.manageStockWithService;
    if (this.manageStockWithService) {
      if (JSON.parse(localStorage.getItem('user'))['name']) {
        this.userName = JSON.parse(localStorage.getItem('user'))['name'];
      }
      this.tabRoles = JSON.parse(localStorage.getItem('roles'));
      if (
        this.tabRoles.includes(1) ||
        this.tabRoles.includes(3) ||
        this.tabRoles.includes(2)
      ) {
        this.takeUrl();
        if (this.storeTypes.includes('bar')) {
          this.takeProductItems();
        }
        if (this.storeTypes.includes('resto')) {
          this.takeProductResto();
        }

        this.getLastCashOpenDate();
      }
    } else {
      setTimeout(() => {
        this.location.back();
      }, 3000);
      this.translate.get('MENU.auth').subscribe((t) => {
        this.notification.presentToast(t, 'primary');
      });
    }
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      // alert(this.url);
    });
  }
  takeFichePointage() {
    this.ficheService.getPointageList().subscribe((data) => {
      console.log('fiche pointage', data);
    });
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  takeProductItems() {
    this.restApiService.getProductItem().subscribe((data: any[]) => {
      // this.makeSumAddOut();
      data.forEach((elt) => {
        elt.name.replace(/\s/g, '');
        elt['name'] = elt['name'].toUpperCase();
      });
      data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      this.restApiService.setData(data);
      this.segmentChangedEnter();

      this.productsItem = data;
      this.productsItemRandom = data;
      this.productsItem.forEach(async (elt) => {
        if (elt['quantityToConfirm'] > 0) {
          let divi = Math.trunc(elt.quantityItems / elt.packSize);
          let store = elt.quantityStore + elt.quantityToConfirm;
          let divi2 = Math.trunc(store / elt.packSize);
          elt['cassier'] = divi; //cassier en stcok
          elt['btls'] = elt.quantityItems % elt.packSize; //btl en stock
          elt['cassierStore'] = divi2; //cassier en vente
          elt['btlsStore'] = store % elt.packSize; //btl en vente
        } else {
          let divi = Math.trunc(elt.quantityItems / elt.packSize);
          let divi2 = Math.trunc(elt.quantityStore / elt.packSize);
          elt['cassier'] = divi;
          elt['btls'] = elt.quantityItems % elt.packSize;
          elt['cassierStore'] = divi2;
          elt['btlsStore'] = elt.quantityStore % elt.packSize;
        }
      });
    });
  }
  makeSumAddOut() {
    this.restApiService.getProductItem(2).subscribe((data: any[]) => {
      console.log(data);
      // this.inventoryObj = data;

      data.forEach((elt) => {
        elt._id.name.replace(/\s/g, '');
        elt['_id']['name'] = elt['_id']['name'].toUpperCase();
      });
      data.sort((a, b) =>
        a['_id'].name > b['_id'].name
          ? 1
          : b['_id'].name > a['_id'].name
          ? -1
          : 0
      );

      this.segmentChangedEnter();
      // data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      // tab = data;

      // tab.forEach((elt) => {
      this.productsItem = data;
      this.productsItem.forEach(async (elt) => {
        if (elt['_id']['quantityToConfirm'] > 0) {
          let divi = elt['quantity'] / elt['_id'].packSize;

          elt['_id']['cassier'] = elt['quantity'] / elt['_id']['packSize'];
          elt['_id']['btls'] = elt['quantity']; //btl en stock
        } else {
          elt['_id']['cassier'] = elt['quantity'] / elt['_id']['packSize'];
          elt['_id']['btls'] = elt['quantity'];
        }
      });
    });
  }

  takeProductItemsRandom() {}

  //

  takeProductResto() {
    // this.presentLoading();
    this.restApiService.getManufacturedProductItemResto2().subscribe((data) => {
      this.productResto = data;
      if (this.productResto.length > 0) {
      }
    });
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.target.value);
    let check = ev.target.value;
    if (check === 'product') {
      this.btnProducts = true;
      this.btnResto = false;
      this.btnService = false;
    } else if (check === 'productResto') {
      this.btnResto = true;
      this.btnProducts = false;
      this.btnService = false;
    } else if (check === 'service') {
      this.btnService = true;
      this.btnProducts = false;
      this.btnResto = false;
    }
  }

  segmentChangedEnter() {
    this.pet = 'product';
  }

  async presentAlertConfirm() {
    const toast = await this.toastController.create({
      message: 'update successfuly!.',
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-classIn',
    });
    toast.present();
  }

  //open and close cash

  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 60000,
        message: this.texte,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }

  clear() {
    this.productsItem.forEach((prod) => {
      prod['nbrCassier'] = 0;
      prod['sale'] = 0;
      prod['totalCoast'] = 0;
      prod['bouteille'] = 0;
    });
    this.randomObj = {};
    this.totalOut = 0;
    this.totalSale = 0;
  }

  resetCol(id, i) {
    delete this.randomObj[id];
    let a = Object.keys(this.randomObj);

    this.inputs.forEach((elt) => {
      if (elt.name == `ion-input-${i}`) {
        elt.value = '';
      }
    });
  }
  addIncrementCassier(ev, prod, i) {
    console.log(prod);

    let value = parseInt(ev.target['value']);

    // console.log(nbr);
    if (Number.isNaN(value)) {
      let id = prod['_id'];
      this.randomObj[id] = {
        incommingValue:
          this.randomObj[id]['incommingValue'] -
          prod['cassierFound'] * prod['packSize'],
        prod: prod,
      };
      prod['cassierFound'] = 0;
      // this.resetCol(id, i);
    } else {
      let nbr = value * prod['packSize'];

      let id = prod['_id'];
      console.log('value to add  =>', nbr);

      let qtyStore = prod['quantity'];

      prod['cassierFound'] = value;

      let storedItem = this.randomObj[id];

      if (!storedItem) {
        this.randomObj[id] = {
          incommingValue: nbr,
          prod: prod,
        };
      } else {
        let oldValue = this.randomObj[id]['incommingValue'];
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr + oldValue,
          prod: prod,
        };
      }
      console.log(this.randomObj);
    }
  }
  addIncrement(ev, prod, i) {
    let value = parseInt(ev.target['value']);
    if (Number.isNaN(value)) {
      let id = prod['_id'];
      // this.resetCol(id, i);
      this.randomObj[id] = {
        incommingValue: this.randomObj[id]['incommingValue'] - prod['btlFound'],
        prod: prod,
      };
      prod['btlFound'] = 0;
    } else {
      let id = prod['_id'];
      let nbr = value;
      let storedItem = this.randomObj[id];
      prod['btlFound'] = nbr;
      if (!storedItem) {
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr,
          prod: prod,
        };
      } else {
        let oldValue = this.randomObj[id]['incommingValue'];
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr + oldValue,
          prod: prod,
        };
      }
      console.log(this.randomObj);
    }
  }

  addIncrementResto(ev, prod, i) {
    let value = parseInt(ev.target['value']);
    if (Number.isNaN(value)) {
      let id = prod['_id'];
      delete this.randomObj[id];
      let a = Object.keys(this.randomObj);
    } else {
      let id = prod['_id'];
      let nbr = value;
      let storedItem = this.randomObj[id];

      if (!storedItem) {
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr,
          prod: prod,
        };
      } else {
        let oldValue = this.randomObj[id]['incommingValue'];
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr + oldValue,
          prod: prod,
        };
      }
      console.log(this.randomObj);
    }
  }

  generateArray(randomObj) {
    const arr = [];
    for (var id in randomObj) {
      arr.push(randomObj[id]);
    }
    this.cart = arr;
    return arr;
  }

  async launchAll() {
    let tabInventaire = this.generateArray(this.randomObj);
    let tabVerificateur = this.generateArray(this.quantityOut); //this.quantityOut represente les produits vendus

    if (tabVerificateur.length > tabInventaire.length) {
      this.notification.presentError(
        'please make inventory for all product',
        'warning'
      );
    } else {
      this.presentLoading2();
      let resultTab = await this.loopTabinventaire(tabInventaire);
      console.log('resultat here ===>', tabInventaire);

      resultTab = await this.loopTabinventaireOut(resultTab);

      this.managerService.postInvetory(resultTab, this.cashClose).subscribe(
        (result) => {
          console.log(result);
          this.router.navigateByUrl('inventaire-list');
          this.dismissLoading()
            .then((res) => {
              console.log('load dismmiss');
            })
            .catch((err) => console.log(err));
        },
        (err) => {
          console.log(err);
        }
      );
    }
    // let tabIn = this.generateArray(this.quantityIn);
  }

  takeTheLastInventory() {
    this.managerService.getLastInventory().subscribe(
      (result: any[]) => {
        console.log(result);
        let oldDate = result[0]['created'];
        let newDate = new Date().toISOString();

        // this.takeLastPurchase(oldDate, newDate);
        // this.takeLastBills(oldDate, newDate);

        if (result[0] && result[0]['Inventory']) {
          this.lastInventory = result[0];
          // this.transformLastInventoryArrayInObject(result[0]['Inventory']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // prendre la liste des achats;
  takeLastPurchase(oldDate, newDate) {
    let tab = [];
    this.managerService.getLastPurchases(oldDate, newDate).subscribe(
      (result: any) => {
        console.log('dernier achats', result);
        if (result.length) {
          result.forEach((elt) => {
            elt.articles.forEach((article) => {
              article.products.forEach((prod) => {
                //this.quantityIn represente l'objet qui contient l'id du produit en clé et la somme des achats du produit en valeur
                console.log(prod);
                let id = '';
                if (prod['item'] && prod['item']['productItemId']) {
                  id = prod['item']['productItemId'];
                } else {
                  id = prod['item']['_id'];
                }
                if (
                  prod['item']['resourceList'] &&
                  prod['item']['resourceList'].length
                ) {
                  this.manageResource(prod, 'in');
                }

                if (this.quantityIn[id]) {
                  //si l' id du produit es contenu dans quantityIn
                  if (prod['item']['sizePack']) {
                    this.quantityIn[id]['quantityIN'] =
                      this.quantityIn[id]['quantityIN'] +
                      prod['qty'] * prod['item']['sizePack'];
                  } else {
                    this.quantityIn[id]['quantityIN'] =
                      this.quantityIn[id]['quantityIN'] + prod['qty'];
                  }
                } else {
                  if (prod['item']['sizePack']) {
                    this.quantityIn[id] = {
                      quantityIN: prod['qty'] * prod['item']['sizePack'],
                    };
                  } else {
                    this.quantityIn[id] = {
                      quantityIN: prod['qty'],
                    };
                  }
                }
              });
            });
          });
          console.log('quntity In ===>', this.quantityIn);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  //prendre la liste des factures payées
  takeLastBills(oldDate, newDate) {
    this.managerService.getLastBills(oldDate, newDate).subscribe(
      (result: any) => {
        if (result.length) {
          console.log('hello bills', result);

          result.forEach((elt) => {
            elt.commandes.forEach((commande) => {
              commande.products.forEach((prod) => {
                //  console.log(prod);
                //this.quantityOut represente l'objet qui contient l'id du produit en clé et la somme des sorties du produit en valeur
                if (
                  prod['item']['resourceList'] &&
                  prod['item']['resourceList'].length
                ) {
                  this.manageResource(prod, 'out');
                }
                let id = prod['item']['_id'];
                if (this.quantityOut[id]) {
                  this.quantityOut[id]['quantityOUT'] =
                    this.quantityOut[id]['quantityOUT'] + parseInt(prod['qty']);
                } else {
                  this.quantityOut[id] = { quantityOUT: parseInt(prod['qty']) };
                }
              });
            });
          });
          // console.log(this.quantityOut);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getLastCashOpenDate() {
    this.managerService.getLastCashOpen().subscribe(
      (result: any) => {
        this.cashClose = result[0]['closing_cash'];
        this.managerService
          .getLastInventorie(result[0]['_id'])
          .subscribe((res: any[]) => {
            this.listStart = res;
            let start: any[] = res[0]['listsStart'];
            start.forEach((prod: Product) => {
              this.listStartObject[prod._id] = prod;
            });
          });
      },
      (err) => {
        console.log('erororor', err);
      }
    );
  }
  //
  loopTabinventaire(tabInventaire) {
    return new Promise<any>((resolve) => {
      tabInventaire.forEach((inv) => {
        let id = inv['prod']['_id'];
        if (this.listStartObject[id]) {
          inv['quantityIn'] =
            this.listStartObject[id]['quantityStore'] +
            this.listStartObject[id]['quantityItems'];
          //quantityIn es la somme des achats entre 2 inventaires
          inv['quantityOUT'] = inv['quantityIn'] - inv['incommingValue'];
          inv['lastQuantityIn'] = inv['quantityIn'];
          // inv['reste'] = inv['incommingValue'];
          if (inv['quantityOUT'] >= 0) {
            inv['reste'] = inv['quantityOUT'];
          } else {
            inv['reste'] = 0;
            inv['surplus'] = -1 * inv['quantityOUT'];
          }
          inv['start'] = inv['quantityIn'];
        } else {
          inv['quantityIn'] = 0;
          inv['quantityOUT'] = 0;
        }
      });
      resolve(tabInventaire);
    });
  }

  loopTabinventaireOut(tabOut) {
    return new Promise<any>((resolve) => {
      tabOut.forEach((inv) => {
        let id = inv['prod']['_id'];

        if (this.quantityOut[id]) {
          console.log(this.quantityOut[id]);

          inv['quantityOut'] = this.quantityOut[id]['quantityOUT'];
          if (
            this.lastInventoryObject[id] &&
            this.lastInventoryObject[id]['lastQuantityIn']
          ) {
            if (this.quantityIn[id] && this.quantityIn[id]['quantityIN']) {
              inv['nextQuantityIn'] =
                this.quantityIn[id]['quantityIN'] +
                this.lastInventoryObject[id]['lastQuantityIn'] -
                inv['quantityOut'];
            } else {
              inv['nextQuantityIn'] =
                this.lastInventoryObject[id]['lastQuantityIn'] -
                inv['quantityOut'];
            }
          } else {
            if (this.quantityIn[id] && this.quantityIn[id]['quantityIN']) {
              inv['nextQuantityIn'] =
                this.quantityIn[id]['quantityIN'] - inv['quantityOut'];
            } else {
              inv['nextQuantityIn'] = inv['quantityOut'];
            }
          }
        } else {
          inv['quantityOut'] = 0;
          if (
            this.lastInventoryObject[id] &&
            this.lastInventoryObject[id]['lastQuantityIn']
          ) {
            if (this.quantityIn[id] && this.quantityIn[id]['quantityIN']) {
              inv['nextQuantityIn'] =
                this.quantityIn[id]['quantityIN'] +
                this.lastInventoryObject[id]['lastQuantityIn'];
            } else {
              inv['nextQuantityIn'] =
                this.lastInventoryObject[id]['lastQuantityIn'];
            }
          } else {
            if (this.quantityIn[id] && this.quantityIn[id]['quantityIN']) {
              inv['nextQuantityIn'] = this.quantityIn[id]['quantityIN'];
            } else {
              inv['nextQuantityIn'] = 0;
            }
          }
        }
      });
      resolve(tabOut);
    });
  }

  transformLastInventoryArrayInObject(arr) {
    console.log(arr);
    arr.forEach((inv) => {
      let id = inv['prod']['_id'];
      if (inv['nextQuantityIn']) {
        console.log(inv['nextQuantityIn']);

        this.lastInventoryObject[id] = {
          lastQuantityIn: inv['nextQuantityIn'],
        };
      } else {
        this.lastInventoryObject[id] = { lastQuantityIn: 0 };
      }
    });

    console.log('dernier inventaire===', this.lastInventoryObject);
  }
  manageResource(prod, check) {
    if (check === 'out') {
      let id = prod['item']['_id'];
      if (this.resourceOut[id]) {
        let tab = prod['item']['resourceList'];
        let qty = this.resourceOut[id]['qty'];
        this.resourceOut[id] = {
          resourceList: tab,
          qty: prod['qty'] + qty,
          prod: prod['item'],
        };
      } else {
        this.resourceOut[id] = {
          resourceList: prod['item']['resourceList'],
          qty: prod['qty'],
          prod: prod['item'],
        };
      }
    }

    if (check === 'in') {
      let id = prod['item']['_id'];
      if (this.resourceOut[id]) {
        let tab = prod['item']['resourceList'];
        let qty = this.resourceOut[id]['qty'];
        this.resourceIn[id] = {
          resourceList: tab,
          qty: prod['qty'] + qty,
          prod: prod['item'],
        };
      } else {
        this.resourceIn[id] = {
          resourceList: prod['item']['resourceList'],
          qty: prod['qty'],
          prod: prod['item'],
        };
      }
    }

    console.log(this.resourceIn);
  }
}
