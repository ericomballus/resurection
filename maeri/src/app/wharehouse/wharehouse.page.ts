import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { WarehouseService } from '../services/warehouse.service';
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from '../services/admin.service';
import { UrlService } from '../services/url.service';
import { RefuelingPage } from '../modals/refueling/refueling.page';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ResourcesService } from '../services/resources.service';
import { RangeByStoreService } from '../services/range-by-store.service';
import { ManagesocketService } from '../services/managesocket.service';
import { ConvertToPackService } from '../services/convert-to-pack.service';
import { SaverandomService } from '../services/saverandom.service';
import { Setting } from '../models/setting.models';
@Component({
  selector: 'app-wharehouse',
  templateUrl: './wharehouse.page.html',
  styleUrls: ['./wharehouse.page.scss'],
})
export class WharehousePage implements OnInit {
  public sockets;
  public url;
  productsItem: any;
  productResto: any;
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
  warehousman = false;
  resourceItem: any;
  multiStoreResourceitem: any;
  storeTypeTab = [];
  productServiceTab: any;
  productListTab: any;
  multiStoreList: any;
  multiStoreService: any;
  pet: any;
  setting: Setting;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,

    public router: Router,
    private translateConfigService: TranslateConfigService,
    private warehouseService: WarehouseService,
    public warehouService: WarehouseService,
    public translate: TranslateService,
    public adminService: AdminService,
    public urlService: UrlService,
    public getStoreName: GetStoreNameService,
    public resourceService: ResourcesService,
    public rangeByStoreService: RangeByStoreService,
    private manageSocket: ManagesocketService,
    private convert: ConvertToPackService,
    public saveRandom: SaverandomService
  ) {
    console.log(JSON.parse(localStorage.getItem('user')));

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
  ionViewDidEnter() {}
  ngOnInit() {
    setTimeout(() => {
      this.setting = this.saveRandom.getSetting();
      let arr: string[] = JSON.parse(localStorage.getItem('adminUser'))[
        'storeType'
      ];
      if (this.setting && !this.setting.check_service_quantity) {
        this.storeTypeTab = arr.filter((s) => s !== 'services');
      } else {
        this.storeTypeTab = arr;
      }
      if (
        this.storeTypeTab.includes('bar') ||
        this.storeTypeTab.includes('resto')
      ) {
        if (this.setting && this.setting.use_resource) {
          this.storeTypeTab.push('resource');
        } else if (this.setting.use_resource) {
          this.storeTypeTab.push('resource');
        }
      }
      this.storeTypeTab = this.storeTypeTab.filter((store) => store != 'resto');
      this.pet = this.storeTypeTab[0];
      this.getSetting();
      this.takeUrl();
    }, 2000);
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
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
    this.restApiService.getProductItem().subscribe(async (data: any[]) => {
      let setting = JSON.parse(localStorage.getItem('setting'))[0];

      if (this.tabRoles.includes(3) || this.tabRoles.includes(2)) {
        let Id = JSON.parse(localStorage.getItem('user'))['storeId'];
        console.log(Id);

        const result = data.filter(
          (item) => item.storeId == Id && item['resourceList'].length == 0
        );
        this.productsItem = result;
      } else {
        this.productsItem = data.filter((item) => {
          return item['resourceList'].length == 0;
        });
      }
      this.productsItem = await this.convert.convertToPack(this.productsItem);
      console.log('hello result===>', this.productsItem);

      /* this.productsItem.forEach(async (elt) => {
        if (elt['quantityToConfirm'] > 0) {
          let divi = elt.quantityItems / elt.packSize;
          let store = elt.quantityStore + elt.quantityToConfirm;
          let divi2 = store / elt.packSize;
          elt['cassier'] = parseInt(divi.toString()); //cassier en stcok
          elt['btls'] = elt.quantityItems % elt.packSize; //btl en stock
          elt['cassierStore'] = parseInt(divi2.toString()); //cassier en vente
          // elt["btlsStore"] = store % elt.packSize; //btl en vente
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
          // elt["btlsStore"] = 1;
          if (!Number.isInteger(elt['btlsStore'])) {
            elt['btlsStore'] = parseFloat(elt['btlsStore']).toFixed(2);
          }
        }
      }); */

      let group = this.productsItem.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      this.multiStoreProductitem = [];

      for (const property in group) {
        this.multiStoreProductitem.push(group[property]);
      }

      this.multiStoreProductitem.forEach(async (arr) => {
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });
    });
  }

  webServerSocket(id) {
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}productItem`, (data) => {
        if (data['quantityToConfirm'] > 0) {
          let divi = data.quantityItems / data.packSize;
          let store = data.quantityStore + data.quantityToConfirm;
          let divi2 = store / data.packSize;
          data['cassier'] = parseInt(divi.toString()); //cassier en stcok
          data['btls'] = data.quantityItems % data.packSize; //btl en stock
          data['cassierStore'] = parseInt(divi2.toString()); //cassier en vente
          data['btlsStore'] = store % data.packSize; //btl en vente
        } else {
          let divi = data.quantityItems / data.packSize;
          let divi2 = data.quantityStore / data.packSize;
          data['cassier'] = parseInt(divi.toString());
          data['btls'] = data.quantityItems % data.packSize;
          data['cassierStore'] = parseInt(divi2.toString());
          data['btlsStore'] = data.quantityStore % data.packSize;
        }
        if (data && data['_id']) {
          let index = this.productsItem.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          let urlp = this.productsItem[index]['url'];
          this.productsItem.splice(index, 1, data);
          this.productsItem[index]['url'] = urlp;
        }
      });
      sockets.on(`${id}newProductItem`, (data) => {
        console.log('product item check');

        this.productsItem.unshift(data);
      });
      sockets.on(`${id}productItemToWarehouse`, async (data) => {
        console.log('pack item change ', data);
        if (data && data['_id']) {
          let divi = data.quantityItems / data.packSize;
          let store = data.quantityStore + data.quantityToConfirm;
          let divi2 = store / data.packSize;
          data['cassier'] = parseInt(divi.toString());
          data['btls'] = data.quantityItems % data.packSize;
          data['cassierStore'] = parseInt(divi2.toString());
          data['btlsStore'] = store % data.packSize;
          let index = await this.productsItem.findIndex((elt) => {
            return elt._id === data['_id'];
          });

          let urlp = this.productsItem[index]['url'];
          this.productsItem.splice(index, 1, data);
          this.productsItem[index]['url'] = urlp;
        }
      });

      sockets.on(`${id}productItemToShop`, async (data) => {
        console.log('pack item change ti shop ', data);
        if (data && data['_id']) {
          let index = await this.productsItem.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          //j'enleve sur le stock a  confirmé la quantité qui a été confirmé

          console.log('ce qui es la ', this.productsItem[index]);

          this.productsItem[index]['quantityToConfirm'] =
            data['quantityToConfirm'];
          let urlp = this.productsItem[index]['url'];
          this.productsItem.splice(index, 1, this.productsItem[index]);
          this.productsItem[index]['url'] = urlp;
        }
      });
      sockets.on(`${id}productItemDelete`, async (data) => {
        console.log('items delete', data);
      });
      sockets.on(`${id}manufacturedItem`, async (data) => {
        console.log('manufactured item', data);
        if (data && data['_id']) {
          let index = await this.productResto.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          // this.productResto.splice(index, 1, data);
          let urlp = this.productResto[index]['url'];
          this.productResto.splice(index, 1, data);
          this.productResto[index]['url'] = urlp;
        }
      });
      sockets.on(`${id}transactionNewItem`, async (data) => {
        console.log('transaction item', data);
        /* if (localStorage.getItem("manageStockWithService") === "true") {
          if (data && data["data"].productType == "manufacturedItems") {
            this.confirmTransactionResto(data["data"], data["prod"]);
            // console.log("rien");
          } else {
            this.confirmTransaction(data["data"]);
          }
        } */
      });

      sockets.on(`${id}productlist`, async (data) => {
        this.takeProductListShop();
      });

      sockets.on(`${id}billardItem`, async (data) => {
        this.takeProductServiceList();
      });
    });
  }

  async updateStore(prod) {
    if (this.multiStore) {
      console.log(prod);
      this.warehouService.setProductItem(prod);
      const modal = await this.modalController.create({
        component: RefuelingPage,
        cssClass: 'my-custom-class',
        backdropDismiss: false,
        componentProps: {},
      });
      modal.onWillDismiss().then((data) => {
        console.log(data);
      });
      return await modal.present();
    } else {
      let a: any = {};
      console.log(prod);
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
              console.log(data);
              let qty = data;
              if (prod.quantityItems - parseInt(data['quantity']) < 0) {
                this.presentAlert();
              } else {
                let update = {
                  id: prod._id,
                  quantity: parseInt(data['quantity']),
                  prod: prod,
                  sender: this.userName,
                };
                this.warehouseService
                  /* .updateProductItemStore({
                  id: prod._id,
                  quantity: parseInt(data["quantity"]),
                  prod: prod,
                }) */

                  .updateProductItemStore1(update)
                  .subscribe(
                    (data) => {
                      let update2 = {
                        idprod: prod._id,
                        _id: prod._id,
                        quantityItems: parseInt(qty['quantity']),
                        //prod: prod,
                        sender: this.userName,
                      };
                      this.confirmTransaction(update2);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }
  callShowMessage() {
    this.updateStore(this.translate.instant('toast.message.available'));
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
            console.log('Confirm Ok');
            console.log(data);
            if (prod.quantityItems - parseInt(data['quantity']) < 0) {
              this.presentAlert();
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
                      localStorage.getItem('manageStockWithService') === 'true'
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
    this.restApiService.getManufacturedProductItemResto2().subscribe((data) => {
      console.log(data);
      if (this.tabRoles.includes(3) || this.tabRoles.includes(2)) {
        let Id = JSON.parse(localStorage.getItem('user'))['storeId'];
        console.log(Id);

        const result = data.filter((item) => item.storeId == Id);
        this.productResto = result;
      } else {
        this.productResto = data;
      }
    });
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.target.value);

    let check = ev.target.value;
    if (check === 'product') {
      this.btnProducts = true;
      this.btnResto = false;
      this.btnResource = false;
    } else if (check === 'productResto') {
      this.btnResto = true;
      this.btnProducts = false;
      this.btnResource = false;
    } else if (check === 'resourceItem') {
      this.btnResto = false;
      this.btnProducts = false;
      this.btnResource = true;
    }
  }

  getSetting() {
    console.log('je prend les settings icicicicicii');
    let setting = this.saveRandom.getSetting();
    console.log('setting ===>', setting);

    if (setting && setting['multi_store']) {
      this.multiStore = true;
    }
    this.takeProductItems();
    this.getResources();
    this.takeProductListShop();
    this.takeProductServiceList();
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

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'closeCash',
      message: `open: ${this.casgData.cashFund}`,
      inputs: [
        {
          name: 'closing_cash',
          type: 'number',
          placeholder: 'closing cash',
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
            if (parseInt(data['cashFund'])) {
              data['cashFund'] = parseInt(data['cashFund']);
              // console.log(tableNumber);
            } else {
              //tableNumber = 0;
              // console.log(tableNumber);
            }

            if (parseInt(data['closing_cash'])) {
              data['closing_cash'] = parseInt(data['closing_cash']);
              // console.log(tableNumber);
            } else {
              data['closing_cash'] = 0;
            }
            this.casgData['closing_cash'] = parseInt(data['closing_cash']);
            this.closeCash(data);
            console.log(data);
            console.log(this.casgData);
          },
        },
      ],
    });
    await alert.present();
  }

  async postCashOpen() {
    const alert = await this.alertController.create({
      header: 'CASH OPEN',
      inputs: [
        {
          name: 'cashFund',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          cssClass: 'alertButton',
          handler: (data) => {
            if (data) {
              this.adminService.postCashOpen(data).subscribe((data) => {
                this.takeCashOpen();
                localStorage.removeItem('firstTime');
                localStorage.setItem('firstTime', 'ok');
                this.cashOpened = false;
                localStorage.setItem(
                  'openCashDate',
                  data['message']['openDate']
                );
                // this.router.navigateByUrl("before-inventory");
                this.presentToast('CASH IS OPEN!');
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  closeCash(data) {
    console.log(this.casgData);
    this.adminService.closeCashOpen(this.casgData).subscribe((data) => {
      this.cashOpened = false;
      // localStorage.removeItem("firstTime");
      this.presentToast('CASH IS CLOSE!');
      localStorage.removeItem('openCashDate');
    });
  }

  takeCashOpen() {
    this.adminService.getOpenCash().subscribe((data) => {
      if (data['docs'].length > 0) {
        this.cashOpened = true;
        this.openCashDate = data['docs'][0]['openDate'];
        this.casgData = data['docs'][0];
        this.openCashDateId = data['docs'][0]['_id'];
        //  localStorage.setItem("openCashDate", data["docs"][0]["openDate"]);
        localStorage.setItem('openCashDate', this.openCashDate);
        localStorage.setItem('openCashDateId', data['docs'][0]['_id']);
        localStorage.setItem(
          'openCashDateObj',
          JSON.stringify(data['docs'][0])
        );
      } else {
        this.presentToast('PLEASE OPEN CASH!');
      }
    });
  }
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
      let tab = [];
      this.resourceItem = data['items'].filter((elt) => {
        return elt['desabled'] == false;
      });
      this.resourceItem.forEach((elt) => {
        elt['quantityStore'] = Number(elt['quantityStore']);
        console.log(elt['quantityStore']);

        if (!Number.isInteger(elt['quantityStore'])) {
          elt['quantityStoreFixed'] = elt['quantityStore'].toFixed(2);
        } else {
          elt['quantityStoreFixed'] = elt['quantityStore'];
        }

        if (!Number.isInteger(elt['total'])) {
          elt['total'] = (elt['quantityStore'] + elt['quantityItems']).toFixed(
            2
          );
        } else {
          elt['total'] = elt['quantityStore'] + elt['quantityItems'];
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

  takeProductServiceList() {
    this.restApiService.getBillardList().subscribe(async (data) => {
      if (this.tabRoles.includes(3) || this.tabRoles.includes(2)) {
        let Id = JSON.parse(localStorage.getItem('user'))['storeId'];
        console.log(Id);

        const result = data['product'].filter((item) => item.storeId == Id);
        this.productServiceTab =
          await this.rangeByStoreService.rangeProductByStore(result);
      } else {
        this.productServiceTab =
          await this.rangeByStoreService.rangeProductByStore(data['product']);
      }

      this.multiStoreService = this.productServiceTab;
    });
  }

  takeProductListShop() {
    this.restApiService.getShopList().subscribe(async (data) => {
      console.log(data);

      if (
        (this.tabRoles.includes(3) || this.tabRoles.includes(2)) &&
        !this.saveRandom.getSetting().manage_expenses
      ) {
        let Id = JSON.parse(localStorage.getItem('user'))['storeId'];
        console.log(Id);

        const result = data['product'].filter((item) => item.storeId == Id);
        this.productListTab =
          await this.rangeByStoreService.rangeProductByStore(result);
      } else {
        this.productListTab =
          await this.rangeByStoreService.rangeProductByStore(data['product']);
      }
      console.log(this.productListTab);

      this.multiStoreList = this.productListTab;
    });
  }
}
