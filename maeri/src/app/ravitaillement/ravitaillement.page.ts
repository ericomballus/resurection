import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { WarehouseService } from '../services/warehouse.service';
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
  Platform,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../services/admin.service';
import io from 'socket.io-client';
import { UrlService } from '../services/url.service';
import { RefuelingPage } from '../modals/refueling/refueling.page';
import { GetStoreNameService } from '../services/get-store-name.service';
import { RangeByStoreService } from '../services/range-by-store.service';
import { ResourcesService } from '../services/resources.service';
import { ServiceListService } from '../services/service-list.service';
import { ShopListService } from '../services/shop-list.service';
import { SaverandomService } from '../services/saverandom.service';
import { Setting } from '../models/setting.models';
import { NotificationService } from '../services/notification.service';
import { FichepointageService } from '../services/fichepointage.service';
import { FichePointage } from '../models/fichepointage.model';
import { Product } from '../models/product.model';
import { ElectronService } from '../services/electron.service';
import { FifoService } from '../services/fifo.service';
import { SelectStockPage } from '../modals/select-stock/select-stock.page';

@Component({
  selector: 'app-ravitaillement',
  templateUrl: './ravitaillement.page.html',
  styleUrls: ['./ravitaillement.page.scss'],
})
export class RavitaillementPage implements OnInit {
  public sockets;
  public url;
  productsItem: any;
  productResto: any;
  resouceBtn: any;
  productRestoRandom: any;
  adminId: any;
  tabRoles = [];
  num: Number = 2;
  btnProducts = true;
  btnResto = false;
  btnResource = false;
  userName: any;
  stock_min: Number;
  openCashDate: any;
  openCashDateId: any;
  ip: string;
  lat: any = 0;
  lng: any = 0;
  viewMode = 'invoices';
  products: any;
  products2: any;

  shopAutorisation: boolean = false;
  totalItems = 0;
  desktopTab = [];
  transaction = [];
  cashOpened: Boolean;
  casgData: any;
  tables: any;
  manageStockWithService: Boolean = false;
  vendorRole: Boolean = false;
  multiStore: Boolean = false;
  multiStoreProductitem = [];
  multiStoreProductResto: any;
  warehousman = false;
  resourceItem = [];
  multiStoreResourceitem: any;
  storeTypeTab: string[] = [];
  pet: any;
  productServiceTab: any;
  productListTab: any;
  multiStoreList: any[];
  multiStoreService: any;
  afficheResource = false;
  numIndex: any;
  storeProductArray: any[] = [];
  useRefueling = false;
  supIndex: any;
  minIndex: any;
  setting: Setting;
  firstTime = false;
  fiche: FichePointage;
  isOpen = true;
  confirm = false;
  productsServices: any[] = [];
  URL: string;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private warehouseService: WarehouseService,
    public warehouService: WarehouseService,
    public translate: TranslateService,
    public adminService: AdminService,
    public urlService: UrlService,
    public getStoreName: GetStoreNameService,
    public rangeByStoreService: RangeByStoreService,
    public resourceService: ResourcesService,
    private shoplistService: ShopListService,
    private servicelistService: ServiceListService,
    public saveRandom: SaverandomService,
    private notifi: NotificationService,
    private ficheService: FichepointageService,
    private electronService: ElectronService,
    private plt: Platform,
    private fifoService: FifoService
  ) {
    if (
      JSON.parse(localStorage.getItem('user'))[0] &&
      JSON.parse(localStorage.getItem('user'))[0].venderRole
    ) {
      this.vendorRole = JSON.parse(localStorage.getItem('user'))[0].venderRole;
    }
    if (localStorage.getItem('manageStockWithService') === 'true') {
      this.manageStockWithService = true;
    }

    if (JSON.parse(localStorage.getItem('user'))['name']) {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    }
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(3) ||
      this.tabRoles.includes(2) ||
      this.tabRoles.includes(6)
    ) {
      setTimeout(() => {
        // this.takeProductItems();
      });
      setTimeout(() => {
        this.takeProductResto();
      }, 2000);
    }
    if (this.tabRoles.includes(3)) {
      this.warehousman = true;
    }
    this.languageChanged();
  }

  ionViewWillEnter() {
    this.setting = this.saveRandom.getSetting();
    //this.setting;
    this.takeUrl();
    this.getSetting();
    let arr: string[] = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];
    if (!this.setting.check_service_quantity) {
      this.storeTypeTab = arr.filter((s) => s !== 'services');
    } else {
      this.storeTypeTab = arr;
    }
    if (
      this.storeTypeTab.length == 1 &&
      this.storeTypeTab[0] == 'resto' &&
      this.setting &&
      this.setting.use_resource
    ) {
      setTimeout(() => {
        this.displayResource();
      }, 2000);
    }
    this.pet = this.storeTypeTab[0];

    this.pet = this.storeTypeTab[0];
  }
  ngOnInit() {}

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      console.log('url ici===', data);

      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId, data);
      // alert(this.url);
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
    this.restApiService.getProductItem().subscribe((data: any) => {
      this.segmentChangedEnter();
      data = data.filter((item) => {
        return item['productId'] !== null;
      });
      let setting = JSON.parse(localStorage.getItem('setting'))[0];
      if (this.tabRoles.includes(3) || this.tabRoles.includes(2)) {
        let Id = JSON.parse(localStorage.getItem('user'))['storeId'];

        const result = data.filter(
          (item) => item.storeId == Id && item['resourceList'].length == 0
        );
        this.productsItem = result;
      } else {
        this.productsItem = data.filter((item) => {
          return item['resourceList'].length == 0 && item['productId'] !== null;
        });
      }
      // this.productsItem = data;
      this.productsItem.forEach(async (elt) => {
        console.log(elt);
        let divi = elt.quantityItems / elt.packSize;
        let divi2 = elt.quantityStore / elt.packSize;
        elt['cassier'] = parseInt(divi.toString());
        elt['btls'] = elt.quantityItems % elt.packSize;
        elt['cassierStore'] = parseInt(divi2.toString());
        elt['btlsStore'] = elt.quantityStore % elt.packSize;
        if (!Number.isInteger(elt['btls'])) {
          elt['btls'] = elt['btls'].toFixed(2);
        }
        // elt["btlsStore"] = 1;
        if (!Number.isInteger(elt['btlsStore'])) {
          elt['btlsStore'] = parseFloat(elt['btlsStore']).toFixed(2);
        }
        /* if (elt['quantityToConfirm'] > 0) {
          let divi = elt.quantityItems / elt.packSize;
          let store = elt.quantityStore + elt.quantityToConfirm;
          let divi2 = store / elt.packSize;
          elt['cassier'] = parseInt(divi.toString()); //cassier en stcok
          elt['btls'] = elt.quantityItems % elt.packSize; //btl en stock
          elt['cassierStore'] = parseInt(divi2.toString()); //cassier en vente
          if (!Number.isInteger(elt['btls'])) {
            elt['btls'] = elt['btls'].toFixed(2);
          }
          elt['btlsStore'] = 1;
        } else {
          let divi = elt.quantityItems / elt.packSize;
          let divi2 = elt.quantityStore / elt.packSize;
          elt['cassier'] = parseInt(divi.toString());
          elt['btls'] = elt.quantityItems % elt.packSize;
          elt['cassierStore'] = parseInt(divi2.toString());
          elt['btlsStore'] = elt.quantityStore % elt.packSize;
          if (!Number.isInteger(elt['btls'])) {
            elt['btls'] = elt['btls'].toFixed(2);
          }
         
          if (!Number.isInteger(elt['btlsStore'])) {
            elt['btlsStore'] = parseFloat(elt['btlsStore']).toFixed(2);
          }
        } */
      });
      let group = this.productsItem.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      this.multiStoreProductitem = [];
      console.log(group);

      for (const property in group) {
        this.multiStoreProductitem.push(group[property]);
      }
      this.multiStoreProductitem.forEach(async (arr) => {
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });
    });
  }

  webServerSocket(id, url) {
    console.log('start', this.url);
    this.sockets = io(url);
    this.sockets.on('connect', function () {
      console.log('je suis connecté socket', url);
    });

    let storeId = this.saveRandom.getStoreId();
    console.log('storeId', storeId);
    this.sockets.on(`${id}productItem`, (data) => {
      console.log('socket io', data);

      if (data['quantityToConfirm'] > 0) {
        let divi = data.quantityItems / data.packSize;
        let store = data.quantityStore + data.quantityToConfirm;
        let divi2 = store / data.packSize;
        data['cassier'] = parseInt(divi.toString()); //cassier en stcok
        data['btls'] = data.quantityItems % data.packSize; //btl en stock
        // data['cassierStore'] = parseInt(divi2.toString()); //cassier en vente
        // data['btlsStore'] = store % data.packSize; //btl en vente
        if (!Number.isInteger(data['btls'])) {
          data['btls'] = data['btls'].toFixed(2);
        }

        // if (!Number.isInteger(data['btlsStore'])) {
        // data['btlsStore'] = data['btlsStore'].toFixed(2);
        //}
      } else if (data.quantityItems || data.quantityStore) {
        let divi = data.quantityItems / data.packSize;
        let divi2 = data.quantityStore / data.packSize;
        data['cassier'] = parseInt(divi.toString());
        data['btls'] = data.quantityItems % data.packSize;
        //data['cassierStore'] = parseInt(divi2.toString());
        // data['btlsStore'] = data.quantityStore % data.packSize;
        if (!Number.isInteger(data['btls'])) {
          data['btls'] = data['btls'].toFixed(2);
        }

        /* if (!Number.isInteger(data['btlsStore'])) {
          data['btlsStore'] = data['btlsStore'].toFixed(2);
        }*/
      }
      if (data && data['_id'] && this.storeProductArray.length) {
        let index = this.storeProductArray.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        if (
          index >= 0 &&
          this.storeProductArray[index] &&
          this.storeProductArray[index]['url']
        ) {
          let urlp = this.storeProductArray[index]['url'];
          data['cassierStore'] = this.storeProductArray[index]['cassierStore'];
          data['btlsStore'] = this.storeProductArray[index]['btlsStore'];
          this.storeProductArray.splice(index, 1, data);
          this.storeProductArray[index]['url'] = urlp;
        }
      }
      this.multiStoreProductitem.splice(
        this.numIndex,
        1,
        this.storeProductArray
      );
    });

    this.sockets.on(`${id}newProductItem`, (data) => {
      console.log('product item check');

      this.productsItem.unshift(data);
    });
    this.sockets.on(`${id}productItemToWarehouse`, async (data) => {
      console.log('pack item change ', data);
      if (data && data['_id']) {
        let divi = data.quantityItems / data.packSize;
        let store = data.quantityStore + data.quantityToConfirm;
        let divi2 = store / data.packSize;
        data['cassier'] = parseInt(divi.toString());
        data['btls'] = data.quantityItems % data.packSize;
        data['cassierStore'] = parseInt(divi2.toString());
        data['btlsStore'] = store % data.packSize;

        if (!Number.isInteger(data['btls'])) {
          data['btls'] = data['btls'].toFixed(2);
        }

        if (!Number.isInteger(data['btlsStore'])) {
          data['btlsStore'] = data['btlsStore'].toFixed(2);
        }
        if (data && data['_id'] && this.storeProductArray.length) {
          let index = this.storeProductArray.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          if (
            index &&
            this.storeProductArray[index] &&
            this.storeProductArray[index]['url']
          ) {
            let urlp = this.storeProductArray[index]['url'];

            this.storeProductArray.splice(index, 1, data);
            this.storeProductArray[index]['url'] = urlp;
          }
        }
        this.multiStoreProductitem.splice(
          this.numIndex,
          1,
          this.storeProductArray
        );
      }
    });

    this.sockets.on(`${id}productItemToShop`, async (data) => {});

    this.sockets.on(`${id}productItemDelete`, async (data) => {
      console.log('items delete', data);
    });
    this.sockets.on(`${id}manufacturedItem`, async (data) => {
      console.log('manufactured item', data);

      if (data && data['_id']) {
        let index = this.productRestoRandom.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        // this.productResto.splice(index, 1, data);
        let urlp = this.productRestoRandom[index]['url'];
        this.productRestoRandom.splice(index, 1, data);
        this.productRestoRandom[index]['url'] = urlp;
        this.multiStoreProductResto =
          await this.rangeByStoreService.rangeProductByStore(
            this.productRestoRandom
          );
      }
    });

    this.sockets.on(`${id}resourceItem`, async (data) => {
      console.log('resource item', data);

      if (data && data['_id']) {
        let index = this.resourceItem.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        // this.productResto.splice(index, 1, data);
        if (index >= 0) {
        }
        this.resourceItem.splice(index, 1, data);

        this.multiStoreResourceitem =
          await this.rangeByStoreService.rangeProductByStore(this.resourceItem);
      }
    });

    this.sockets.on(`${id}transactionNewItem`, async (data) => {
      console.log('transaction item', data);
    });

    this.sockets.on(`${id}${storeId}billardItemRestore`, async (data) => {
      if (this.URL) {
        data['url'] = this.URL;
      }
      let childArr: any[] = this.multiStoreService[this.supIndex];
      childArr.splice(this.minIndex, 1, data);
      // this.takeProductServiceList();
    });

    this.sockets.on(`${id}shopList`, async (data) => {
      let childArr: any[] = this.multiStoreList[this.supIndex];
      childArr.splice(this.minIndex, 1, data);
      // this.takeProductServiceList();
    });

    this.sockets.on(`${id}FifoProductlist`, async (data) => {
      this.multiStoreList.forEach((arr: any[]) => {
        let index = arr.findIndex((p) => p._id == data._id);
        if (index >= 0) {
          arr.splice(index, 1, data);
        }
      });
    });

    this.sockets.on(`${id}${storeId}billardItem`, async (data: Product) => {
      if (data.quantityToAlert && data.quantityStore <= data.quantityToAlert) {
        let message = `le produit ${data.name} doit etre ravitaillé la quantité en vente est: ${data.quantityStore}`;
        if (this.plt.is('electron')) {
          this.sendNotification(message);
        }
        this.notifi.presentToast(message, 'danger');
      }
      this.multiStoreService.forEach((arr: Product[], ind) => {
        let index = arr.findIndex((prod) => prod._id == data._id);

        if (index >= 0) {
          this.URL = arr[index].url;
          data.url = this.URL;
          arr.splice(index, 1, data);
          this.multiStoreService.splice(ind, 1, arr);
        }
      });
      // this.takeProductServiceList();
    });
  }

  async updateStore(prod, i) {
    let a: any = {};

    this.numIndex = i;
    this.storeProductArray = this.multiStoreProductitem[i];
    this.translate.get('add').subscribe((t) => {
      a.title = t;
    });
    this.translate.get('cancel').subscribe((t) => {
      a.cancel = t;
    });
    this.translate.get('placeholder').subscribe((t) => {
      a.placeholder = t;
    });

    const alert = await this.alertController.create({
      header: `Available ${prod.quantityItems}`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'quantity',
        },
      ],
      buttons: [
        {
          text: a.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: a.title,
          handler: (data) => {
            let qty = data;
            if (prod.quantityItems - parseInt(data['quantity']) < 0) {
              this.presentAlert();
            } else if (parseInt(data['quantity']) <= 0) {
              this.presentAlert();
            } else {
              let update = {
                id: prod._id,
                quantity: parseInt(data['quantity']),
                prod: prod,
                sender: this.userName,
              };
              this.warehouseService
                .updateProductItemStore({
                  id: prod._id,
                  quantity: parseInt(data['quantity']),
                  prod: prod,
                  sender: JSON.parse(localStorage.getItem('user'))['name'],
                  senderId: JSON.parse(localStorage.getItem('user'))['_id'],
                  storeId: JSON.parse(localStorage.getItem('user'))['storeId'],
                })
                .subscribe(
                  (data) => {
                    console.log(data);
                  },
                  (err) => {
                    console.log(err);
                  }
                );

              /* .updateProductItemStore1(update)
                .subscribe(
                  (data) => {},
                  (err) => {
                    console.log(err);
                  }*
                );*/
            }
          },
        },
      ],
    });

    await alert.present();
  }
  callShowMessage(i, j) {
    // this.updateStore(this.translate.instant('toast.message.available'));
  }
  confirmProd(prod) {
    console.log(prod);
    let update2 = {
      idprod: prod._id,
      _id: prod._id,
      quantityItems: parseInt(prod['quantityToConfirm']),
      //prod: prod,
      sender: this.userName,
    };
    let update3 = {
      idprod: prod.itemStoreId,
      _id: prod.itemStoreId,
      quantityItems: parseInt(prod['quantityToConfirm']),
      //prod: prod,
      sender: this.userName,
    };
    this.confirmTransaction(update2);
    this.confirmTransaction(update3);
  }
  //update product resto stock store here
  async updateStoreResto(prod) {
    const alert = await this.alertController.create({
      header: `Avaible ${prod.quantityItems}`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Enter quantity',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (isNaN(parseFloat(data['quantity']))) {
              console.log('not a number');
            } else {
              if (prod.quantityItems - parseFloat(data['quantity']) < 0) {
                this.presentAlert();
              } else if (parseInt(data['quantity']) <= 0) {
                this.presentAlert();
              } else {
                if (prod.resourceType) {
                  let obj = {
                    id: prod._id,
                    quantity: parseFloat(data['quantity']),
                    sender: this.userName,
                    productType: prod.productType,
                  };
                  this.updateStoreResource(obj);
                } else {
                  this.warehouseService
                    .updateManufacturedItemStore({
                      id: prod._id,
                      quantity: parseInt(data['quantity']),
                      sender: this.userName,
                      productType: prod.productType,
                    })
                    .subscribe(
                      (data) => {
                        console.log(data);
                        if (
                          localStorage.getItem('manageStockWithService') ===
                          'true'
                        ) {
                          // this.confirmTransaction(data["resultat"]);
                        }
                        this.presentAlertConfirm();
                      },
                      (err) => {
                        console.log(err);
                      }
                    );
                }
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async updateServicesList(prod, i, j) {
    this.supIndex = i;
    this.minIndex = j;
    this.URL = prod['url'];
    const alert = await this.alertController.create({
      header: `Avaible ${prod.quantityItems} ${prod.name}`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Enter quantity',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (isNaN(parseFloat(data['quantity']))) {
              console.log('not a number');
            } else {
              if (prod.quantityItems - parseFloat(data['quantity']) < 0) {
                this.presentAlert();
              } else if (parseInt(data['quantity']) <= 0) {
                this.presentAlert();
              } else {
                let obj = {
                  id: prod._id,
                  quantity: parseFloat(data['quantity']),
                  sender: this.userName,
                  senderId: JSON.parse(localStorage.getItem('user'))['_id'],
                  productType: prod.productType,
                  prod: prod,
                  storeId: JSON.parse(localStorage.getItem('user'))['storeId'],
                };
                this.updateServiceListStore(obj);
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async updateShopList(prod, i, j) {
    this.supIndex = i;
    this.minIndex = j;
    const alert = await this.alertController.create({
      header: `Avaible ${prod.quantityItems}`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Enter quantity',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (isNaN(parseInt(data['quantity']))) {
              console.log('not a number');
            } else {
              if (prod.quantityItems - parseInt(data['quantity']) < 0) {
                this.presentAlert();
              } else if (parseInt(data['quantity']) <= 0) {
                this.presentAlert();
              } else {
                let obj = {
                  id: prod._id,
                  quantity: parseInt(data['quantity']),
                  sender: this.userName,
                  productType: prod.productType,
                  prod: prod,
                  senderId: JSON.parse(localStorage.getItem('user'))['_id'],
                  storeId: JSON.parse(localStorage.getItem('user'))['storeId'],
                };
                this.updateShopListStore(obj);
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }
  //
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'ALERT',
      // subHeader: ` ${data}`,
      //message: data.data.message,
      message: 'NOT ENOUGTH IN STOCK.',
      cssClass: 'AlertStock',
      buttons: ['OK'],
    });

    await alert.present();
  }
  takeProductResto() {
    // this.presentLoading();
    this.restApiService
      .getManufacturedProductItemResto2()
      .subscribe(async (data) => {
        console.log(data);
        let product;
        if (this.tabRoles.includes(3) || this.tabRoles.includes(2)) {
          let Id = JSON.parse(localStorage.getItem('user'))['storeId'];
          console.log(Id);

          product = data.filter((item) => item.storeId == Id);
          this.productRestoRandom = product;
        } else {
          product = data;
          this.productRestoRandom = product;
        }
        this.multiStoreProductResto =
          await this.rangeByStoreService.rangeProductByStore(product);

        //this.productRestoRandom = data;
      });
  }
  segmentChanged(ev: any) {
    this.afficheResource = false;
    console.log('Segment changed', ev.target.value);
    let check = ev.target.value;

    if (check === 'resto') {
      this.displayResource();
    }
  }

  segmentChangedEnter() {}

  getSetting() {
    let setting: Setting = this.saveRandom.getSetting();
    if (setting && setting.multi_store) {
      this.multiStore = true;
    }
    if (setting && setting.use_gamme) {
      this.useRefueling = true;
      // this.takeFichePointage();
      this.takeProductItems();
      this.getResources();
      this.takeProductServiceList();
      this.takeProductListShop();
    } else {
      this.takeProductItems();
      this.getResources();
      //  this.takePackItems();
      this.takeProductServiceList();
      this.takeProductListShop();
    }
  }
  takePackItems() {
    this.restApiService.getPackItem().subscribe((data) => {
      data['items'].forEach((element) => {
        element['totalItems'] = element['quantity'] * element['itemsInPack'];
      });
      console.log(data);
      this.productsItem = data['items'];
    });
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

  async presentActionSheet(items) {
    console.log(items);
    const actionSheet = await this.actionSheetController.create({
      //  header: "Albums",
      buttons: [
        {
          text: 'View Details',
          icon: 'heart',
          handler: () => {
            /// this.displayDetails(items);
          },
        },
        {
          text: 'Reset one',
          icon: 'close',

          handler: () => {
            console.log('Cancel clicked');
            console.log(items);
            this.restApiService
              .resetProductItem({ id: items._id })
              .subscribe((data) => {
                console.log(data);
              });
          },
        },
        {
          text: 'Reset all',
          icon: 'close',

          handler: () => {
            console.log('Cancel clicked');
            console.log(items);
            this.productsItem.forEach((items) => {
              setTimeout(() => {
                this.restApiService
                  .resetProductItem({ id: items._id })
                  .subscribe((data) => {
                    console.log(data);
                  });
              }, 1000);
            });
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentActionSheet2(items) {
    console.log(items);
    const actionSheet = await this.actionSheetController.create({
      //  header: "Albums",
      buttons: [
        {
          text: 'View Details',
          icon: 'heart',
          handler: () => {
            /// this.displayDetails(items);
          },
        },
        {
          text: 'Reset',
          icon: 'close',

          handler: () => {
            console.log('Cancel clicked');
            console.log(items);
            this.restApiService
              .resetManufacturedItem({ id: items._id })
              .subscribe((data) => {
                console.log(data);
              });
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentActionSheet3(prod: Product) {
    console.log(prod);
    const actionSheet = await this.actionSheetController.create({
      //  header: "Albums",
      buttons: [
        {
          text: 'ANNULER',
          icon: 'heart',
          handler: () => {
            /// this.displayDetails(items);
          },
        },
        {
          text: 'RESET',
          icon: 'close',

          handler: () => {
            prod.quantityStore = 0;
            prod.quantityItems = 0;
            this.notifi.presentLoading();
            this.restApiService.updateBillardGame(prod).subscribe((data) => {
              console.log(data);
              this.notifi.dismissLoading();
            });
          },
        },
      ],
    });
    await actionSheet.present();
  }
  confirmTransactionResto(prod, data) {
    console.log(data);

    let obj = {
      id: data['productId'],
      quantity: prod['quantityItems'],
      receiver: this.userName,
    };
    this.adminService
      .confirmTransaction(prod._id, this.userName)
      .subscribe((res) => {
        prod['confirm'] = true;
        prod['receiver'] = this.userName;
        let data2 = {
          id: obj['id'],
          quantity: prod['quantityItems'],
          receiver: this.userName,
        };
        this.warehouService
          .updateManufacturedItemStoreConfirm(data2)
          .subscribe((data) => {
            console.log(data);
          });
      });
  }
  confirmTransaction(prod) {
    console.log(prod);
    if (prod.productType == 'manufacturedItems') {
      let data = {
        id: prod['_id'],
        quantity: prod['quantityItems'],
        receiver: this.userName,
      };
      this.adminService
        .confirmTransaction(prod._id, this.userName)
        .subscribe((res) => {
          prod['confirm'] = true;
          prod['receiver'] = this.userName;
          let data2 = {
            id: prod['_id'],
            quantity: prod['quantityItems'],
            receiver: this.userName,
          };
          this.warehouService
            .updateManufacturedItemStoreConfirm(data2)
            .subscribe((data) => {
              console.log(data);
            });
        });
    } else {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
      let data = {
        id: prod['idprod'],
        quantity: prod['quantityItems'],
        receiver: this.userName,
      };

      this.warehouService.updateProductItemStore(data).subscribe((res) => {
        prod['confirm'] = true;
        this.adminService
          .confirmTransaction(prod._id, this.userName)
          .subscribe((data) => {
            this.restApiService.clearProvision();

            this.warehouService
              .confirmProductItemStore({
                id: prod['idprod'],
                receiver: this.userName,
              })
              .subscribe((data) => {});
            //this.transaction = data["docs"];
          });
      });
    }
  }

  //open and close cash

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
      position: 'top',
      animated: true,
      //cssClass: "my-custom-class"
    });
    toast.present();
  }
  getResources() {
    this.resourceService.getStoreResourcesItem().subscribe((data) => {
      console.log(data);

      this.resourceItem = data['items'].filter((elt) => {
        return elt['desabled'] == false;
      });

      this.resourceItem.forEach((elt) => {
        if (!Number.isInteger(elt['quantityStore'])) {
          elt['quantityStore'] = parseFloat(elt['quantityStore']).toFixed(2);
        } else {
          elt['quantityStore'] = parseFloat(elt['quantityStore']);
        }
      });

      this.rangeByStoreService
        .rangeProductByStore(this.resourceItem)
        .then((res: any[]) => {
          console.log(res);
          this.multiStoreResourceitem = res;
        });
    });
  }

  displayResource() {
    let page = '';
    //product-manufactured
    if (this.pet == 'bar') {
      console.log('bar ici');

      page = 'product-list';
    }
    if (this.pet == 'services') {
      console.log('services ici');
      page = 'billard';
    }
    if (this.pet == 'resto') {
      page = 'product-manufactured';
    }
    let tab = this.resourceItem.filter((elt) => {
      if (elt.page) {
        return elt.page == page;
      }
    });

    this.rangeByStoreService.rangeProductByStore(tab).then((res: any[]) => {
      this.multiStoreResourceitem = res;
    });
    this.afficheResource = true;
  }

  takeProductServiceList() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getBillardList().subscribe(async (data) => {
      let a = data['product'].sort((b, c) => {
        if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
          return 1;
        }
        if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
          return -1;
        }
        return 0;
      });
      if (this.saveRandom.getSuperManager()) {
        // a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      } else {
        // a = data['product'].filter((elt) => elt.storeId === storeId);
      }
      // a = a.sort((c, b) => (c.name > b.name ? 1 : -1));
      a = data['product'];
      if (data['product'].length) {
        data['product'].forEach((prod) => {
          if (prod.filename) {
            if (prod.imageId) {
              prod['url'] = this.url + `images/${prod.imageId}`;
            } else {
              prod.url =
                this.url +
                'billard/' +
                prod._id +
                '?db=' +
                localStorage.getItem('adminId');
            }
          }
        });
      }
      this.productServiceTab =
        await this.rangeByStoreService.rangeProductByStore(a);
      console.log(this.productServiceTab);

      this.multiStoreService = this.productServiceTab;
    });
  }

  takeProductListShop() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getShopList().subscribe(async (data) => {
      let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));

      if (
        this.saveRandom.getSuperManager() ||
        this.saveRandom.getSetting().manage_expenses
      ) {
        // a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      } else {
        a = data['product'].filter((elt) => elt.storeId === storeId);
      }

      this.productListTab = await this.rangeByStoreService.rangeProductByStore(
        a
      );

      this.multiStoreList = this.productListTab;
    });
  }

  updateStoreResource(prod) {
    this.resourceService.updateResourceStore(prod).subscribe((resp) => {
      this.getResources();
    });
  }

  updateServiceListStore(prod) {
    this.servicelistService.updateServiceStore(prod).subscribe((resp) => {
      // this.takeProductServiceList();
      if (this.fiche) {
        this.updateFiche(prod.id, prod.quantity);
      } else {
        // pas de fiche de pointage
      }
    });
  }

  updateShopListStore(prod) {
    this.shoplistService.updateResourceStore(prod).subscribe((resp) => {
      // this.takeProductListShop();
    });
  }

  goToRefueling() {
    // this.router.navigateByUrl('manager-refueling');
    this.router.navigateByUrl('procurment-product-item');
  }

  takeFichePointage() {
    console.log('je prend la fiche');

    this.ficheService.getPointageList().subscribe(
      (docs: FichePointage[]) => {
        let storeId = this.saveRandom.getStoreId();

        if (docs.length) {
          docs = docs.filter((fiche) => fiche.storeId == storeId);
        }
        if (!docs.length) {
        } else {
          this.fiche = docs[0];
          this.productsServices = docs[0].list;
        }
      },
      (err) => {
        this.notifi.dismissLoading();
        console.log(err);
      }
    );
  }
  updateFiche(id, quantity) {
    let products = this.fiche.list;
    let index = products.findIndex((prod) => prod._id == id);
    if (index >= 0) {
      let obj = { date: Date.now(), qty: quantity };
      if (products[index]['pointageList']) {
        products[index]['pointageList'].push(obj);
      } else {
        products[index]['pointageList'] = [];
        products[index]['pointageList'].push(obj);
      }
      products[index]['pointage'] = 0;
      products[index]['pointageList'].forEach((elt) => {
        if (products[index]['pointage']) {
          products[index]['pointage'] = products[index]['pointage'] + elt.qty;
        } else {
          products[index]['pointage'] = elt.qty;
        }
      });
      this.fiche.list = products;
      this.ficheService.updateFichePointage(this.fiche).subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  sendNotification(msg) {
    this.electronService.showNotification(msg);
  }
  async refueling(prod, i, j) {
    this.notifi.presentLoading();
    this.fifoService.getProductAvaibleStock(prod._id).subscribe(
      (docs: any[]) => {
        console.log(docs);
        this.notifi.dismissLoading();
        if (docs.length) {
          this.saveRandom.setAvaibleStock(docs);
          this.openStockManager();
        }
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi.presentError('some error found', 'danger');
      }
    );
  }

  async openStockManager() {
    const modal = await this.modalController.create({
      component: SelectStockPage,
      componentProps: {},
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
}
