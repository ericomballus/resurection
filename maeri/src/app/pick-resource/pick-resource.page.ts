import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  AlertController,
  NavParams,
} from '@ionic/angular';
import { ResourcesService } from 'src/app/services/resources.service';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { RestApiService } from '../services/rest-api.service';
import { log } from 'console';
import { NotificationService } from '../services/notification.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-pick-resource',
  templateUrl: './pick-resource.page.html',
  styleUrls: ['./pick-resource.page.scss'],
})
export class PickResourcePage implements OnInit {
  resources = [];
  resourcesTab: any;
  productTab: any;
  resourcesClone = [];
  tab = [];
  tabs = [];
  selection: string = 'piece';
  selectedProduct = false;
  selectedResource = false;
  incomingItems = false;
  page = '';
  constructor(
    private resourceService: ResourcesService,
    private modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public toastController: ToastController,
    public alertController: AlertController,
    public restApiService: RestApiService,
    public navParams: NavParams,
    private notification: NotificationService,
    public saveRandom: SaverandomService
  ) {
    this.tabs = this.navParams.get('tabs');
    this.page = this.navParams.get('page');

    if (this.tabs && this.tabs.length) {
      this.incomingItems = true;

      this.tabs.forEach((prod) => {
        console.log(prod);
        /*  prod["isChecked"] = true;
        prod["exist"] = true;
        prod["toAdd2"] = prod.quantity;
        prod["toAdd"] = prod.quantity;
        prod["oldUnit"] = prod.unitName; */
        if (prod['prod']) {
          let data = prod['prod'];

          data['toAdd'] = prod.quantity;
          data['isChecked'] = true;
          this.resources.push(data);
        }
      });
      // console.log(this.tabs);
      // this.tab = this.tabs;
      // this.resources = this.tabs;
    }
  }

  ngOnInit() {
    this.page = this.navParams.get('page');
    this.getUserStoreTypes();
    this.languageChanged();
    this.getResources();
    this.takeProduct();
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  getResources() {
    this.resourceService.getResources().subscribe((data) => {
      this.resourcesTab = data['resources'];
      console.log(this.resourcesTab);
      this.resourcesTab = this.resourcesTab.filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
      // this.getResourcesForClone();
      this.resourcesTab.forEach((resource) => {
        resource['oldUnit'] = resource.unitName;
        resource['toAdd2'] = 0;
        resource['exist'] = true;
      });
    });
  }
  getAllProductItem() {
    this.resourceService.getProductItem().subscribe((products) => {
      console.log(products);
    });
  }

  getUserStoreTypes() {
    let tab = [];
    tab = this.saveRandom.getStoreTypeList();
    tab.forEach((title, index) => {
      if (title == 'services') {
        // this.takeServiceList();
      }
      if (title == 'bar') {
        //this.storeTypeTab[index] = 'Gammes';
        this.takeProduct();
      }
    });
  }

  takeProduct() {
    this.restApiService.getProductList().subscribe((data) => {
      data['products'] = data['products'].filter((prod) => {
        return prod['resourceList'].length == 0;
      });
      data['products'].forEach((prod) => {
        prod['product'] = true;
        prod['oldUnit'] = prod.unitName;
        prod['toAdd2'] = 0;
      });
      this.productTab = data['products'];
      // this.resources = [...this.resources, ...data["products"]];
    });
  }

  takeServiceList() {
    this.restApiService.getBillardList().subscribe((data) => {
      console.log(data);

      data['product'].forEach((prod) => {
        prod['product'] = true;
        prod['oldUnit'] = prod.unitName;
        prod['toAdd2'] = 0;
      });
      this.productTab = [...this.productTab, ...data['products']];
      // this.resources = [...this.resources, ...data["products"]];
    });
  }
  getResourcesForClone() {
    this.resourceService.getResources().subscribe((data) => {
      this.resourcesClone = data['resources'];
    });
  }
  closeModal() {
    // this.modalController.dismiss(this.products);

    this.modalController.dismiss();
  }
  pickResource(prod) {
    this.modalController.dismiss(prod);
  }
  addRes(prod, ev) {
    let quantity = ev.target.value;
    let coast = 0;
    if (!quantity || isNaN(quantity)) {
      if (this.tab.length) {
        this.tab = this.tab.filter((elt) => {
          return elt.resourceId !== prod._id;
        });
        //  prod.toAdd = 0;
        console.log(this.tab);
      }

      return;
    }

    prod.toAdd = parseFloat(quantity);
    prod['toAdd2'] = parseFloat(quantity);
    // this.selection = prod["unitName"];
    if (prod.oldUnit !== prod.unitName) {
      console.log(this.calculateCoast(prod));
      coast = this.calculateCoast(prod);
    } else {
      coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
    }
    let product = false;
    if (prod.product) {
      product = true;
    }
    let resourceId = '';
    if (prod._id) {
      resourceId = prod._id;
    } else {
      resourceId = prod.resourceId;
    }
    let result = {
      quantity: prod.toAdd,
      unitName: prod.unitName,
      name: prod.name,
      resourceId: resourceId,
      product: product,
      prod: prod,
      coast: coast,
    };

    if (this.tab.length) {
      let index = this.tab.findIndex((res) => {
        return res.resourceId == result.resourceId;
      });

      if (index >= 0) {
        this.tab.splice(index, 1, result);
      } else {
        this.tab.push(result);
      }
    } else {
      this.tab.push(result);
    }
  }
  /* async addRes(prod) {
    let a: any = {};
    if (prod.exist) {
      prod = prod["prod"];
    }
    this.translate.get("add").subscribe((t) => {
      a.title = t;
    });
    this.translate.get("cancel").subscribe((t) => {
      a.cancel = t;
    });
    this.translate.get("placeholder").subscribe((t) => {
      a.placeholder = t;
    });

    const alert = await this.alertController.create({
      header: ` ${prod.name}`,
      inputs: [
        {
          name: "quantity",
          type: "text",
          placeholder: "quantity",
        },
      ],
      buttons: [
        {
          text: a.cancel,
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: a.title,
          handler: (data) => {
            let coast = 0;
            prod.toAdd = parseFloat(data["quantity"]);
            prod["toAdd2"] = parseFloat(data["quantity"]);
            // this.selection = prod["unitName"];
            if (prod.oldUnit !== prod.unitName) {
              console.log(this.calculateCoast(prod));
              coast = this.calculateCoast(prod);
            } else {
              coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
            }
            let product = false;
            if (prod.product) {
              product = true;
            }
            let resourceId = "";
            if (prod._id) {
              resourceId = prod._id;
            } else {
              resourceId = prod.resourceId;
            }
            let result = {
              quantity: prod.toAdd,
              unitName: prod.unitName,
              name: prod.name,
              resourceId: resourceId,
              product: product,
              prod: prod,
              coast: coast,
            };

            if (this.tab.length) {
              let index = this.tab.findIndex((res) => {
                return res.resourceId == result.resourceId;
              });

              if (index >= 0) {
                this.tab.splice(index, 1, result);
              } else {
                this.tab.push(result);
              }
            } else {
              this.tab.push(result);
            }
          },
        },
      ], 
    });

    await alert.present();
  } */
  addUnit(select, prod) {
    let coast = 0;
    if (prod.oldUnit !== prod.unitName) {
      if (prod.oldUnit == 'l' && prod.unitName == 'cl') {
        // prod["toAdd"] = prod.toAdd / 1000;

        let randomQty = prod.toAdd / 100;

        prod['toAdd'] = prod.toAdd;
        coast = (randomQty * prod.purchasingPrice) / prod.sizeUnit;
      } else if (prod.oldUnit == 'cl' && prod.unitName == 'l') {
        prod['toAdd'] = prod.toAdd * 1000;
        coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
      } else if (prod.oldUnit == 'g' && prod.unitName == 'kg') {
        // prod["toAdd"] = prod.toAdd * 1000;
        prod['toAdd'] = prod.toAdd;
        coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
      } else if (prod.oldUnit == 'kg' && prod.unitName == 'g') {
        // prod["toAdd"] = prod.toAdd / 1000;
        prod['toAdd'] = prod.toAdd;
        let randomQty = prod.toAdd / 100;
        coast = (randomQty * prod.purchasingPrice) / prod.sizeUnit;
      } else {
      }
      let product = false;
      if (prod.product) {
        product = true;
      }
      let result = {
        quantity: prod.toAdd,
        unitName: prod.unitName,
        name: prod.name,
        resourceId: prod._id,
        product: product,
        prod: prod,
        coast: coast,
      };
      if (this.tab.length) {
        let index = this.tab.findIndex((res) => {
          return res.resourceId == result.resourceId;
        });

        if (index >= 0) {
          this.tab.splice(index, 1, result);
        } else {
          this.tab.push(result);
        }
      }
    } else {
      if (prod.oldUnit == 'kg' && prod.unitName == 'kg') {
        // prod["toAdd"] = prod.toAdd / 1000;
        prod['toAdd'] = prod.toAdd;

        coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
      }
      if (prod.oldUnit == 'l' && prod.unitName == 'l') {
        // prod["toAdd"] = prod.toAdd / 1000;
        prod['toAdd'] = prod.toAdd;

        coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
        prod['coast'] = coast;
      }
      let result = {
        quantity: prod.toAdd,
        unitName: prod.unitName,
        name: prod.name,
        resourceId: prod._id,
        coast: coast,
      };
      let index = this.tab.findIndex((res) => {
        return res.resourceId == prod._id;
      });

      if (index >= 0) {
        this.tab.splice(index, 1, result);
      }
    }

    if (!prod.toAdd) {
      this.notificationAlert();
    } else {
    }
  }

  calculateCoast(prod) {
    let coast = 0;
    if (prod.oldUnit == 'l' && prod.unitName == 'cl') {
      // prod["toAdd"] = prod.toAdd / 1000;

      let randomQty = prod.toAdd / 100;

      prod['toAdd'] = prod.toAdd;
      coast = (randomQty * prod.purchasingPrice) / prod.sizeUnit;
    } else if (prod.oldUnit == 'cl' && prod.unitName == 'l') {
      prod['toAdd'] = prod.toAdd * 1000;
      coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
    } else if (prod.oldUnit == 'g' && prod.unitName == 'kg') {
      // prod["toAdd"] = prod.toAdd * 1000;
      prod['toAdd'] = prod.toAdd;
      coast = (prod.toAdd * prod.purchasingPrice) / prod.sizeUnit;
    } else if (prod.oldUnit == 'kg' && prod.unitName == 'g') {
      // prod["toAdd"] = prod.toAdd / 1000;
      prod['toAdd'] = prod.toAdd;
      let randomQty = prod.toAdd / 100;
      coast = (randomQty * prod.purchasingPrice) / prod.sizeUnit;
    } else {
    }
    return coast;
  }

  async notificationAlert() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: 'No Product quantity',
      message: 'Please select Product quantity Before.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  done() {
    /* console.log(this.resourcesTab);
    console.log(this.tab);*/

    this.modalController.dismiss(this.tab);
  }

  pickProducts() {
    this.notification.presentLoading();
    this.resourcesClone = [];
    if (this.resources.length) {
      this.resourcesClone = this.resources;
      this.resources = [];
      this.resourcesClone.forEach((res) => {
        this.productTab.forEach((prod) => {
          if (prod._id == res.resourceId || prod._id == res._id) {
            prod['isChecked'] = true;
            prod['incoming'] = true;
          }
        });
      });
      console.log(this.productTab);
    }
    setTimeout(() => {
      // this.resources = this.productTab;
      this.selectedProduct = true;
      this.selectedResource = false;
      this.notification.dismissLoading();
    }, 1000);
  }

  selectResource() {
    this.notification.presentLoading();
    this.resourcesClone = [];
    if (this.resources.length) {
      this.resourcesClone = this.resources;

      this.resourcesClone.forEach((res) => {
        this.resourcesTab.forEach((prod) => {
          if (prod._id == res.resourceId || prod._id == res._id) {
            prod['isChecked'] = true;
            prod['incoming'] = true;
            /*  prod["toAdd"] = res.quantity;
            prod["unitName"] = res.unitName;
            prod["oldUnit "] = res.unitName;
            prod["resourceId"] = res.resourceId;*/
          }
        });
      });
      // this.resources.filter(elt => elt.product == false)
      console.log(this.resourcesTab);

      this.resources = [];
    }
    setTimeout(() => {
      this.selectedProduct = false;
      this.selectedResource = true;
      this.notification.dismissLoading();
    }, 1000);
  }
  confirmProducts() {
    this.notification.presentLoading();
    let tab = [];
    this.selectedProduct = false;
    this.selectedResource = false;
    //  console.log(this.productTab);
    tab = this.productTab.filter((prod) => {
      return prod.isChecked && !prod['incoming'];
    });
    setTimeout(() => {
      this.notification.dismissLoading();
      this.resources = this.resourcesClone;
      this.resources = [...this.resourcesClone, ...tab];
      /*  this.resources = this.resources.filter((item, index) => {
        return this.resources.indexOf(item) === index;
      });*/
      //  this.resources = tabR;
      this.resourcesClone = this.resources;
    }, 600);
  }
  confirmResource() {
    this.notification.presentLoading();
    let tab = [];
    this.selectedProduct = false;
    this.selectedResource = false;

    tab = this.resourcesTab.filter((res) => {
      return res.isChecked && !res['incoming'];
    });
    setTimeout(() => {
      this.notification.dismissLoading();
      this.resources = this.resourcesClone;
      this.resources = [...this.resourcesClone, ...tab];
      /* let tabR = this.resources.filter((item, index) => {
        return this.resources.indexOf(item) === index;
      });*/
      //this.resources = tabR;
      this.resourcesClone = this.resources;
    }, 600);
  }

  deleteResource(res) {
    this.resources = this.resources.filter((resource) => {
      return resource._id !== res._id || resource.resourceId !== res.resourceId;
    });
    console.log(res);

    console.log(this.tab);

    this.tab = this.tab.filter((resource) => {
      return resource.resourceId !== res._id;
    });

    let tab = [...this.productTab, ...this.resourcesTab];
    this.resourcesClone = this.resourcesClone.filter((resource) => {
      tab.forEach((prod) => {
        if (prod._id == resource.resourceId || prod._id == resource._id) {
          prod['isChecked'] = false;
        }
      });
      /* if (resource.exist) {
        return resource._id !== res._id;
      } else {
        return resource._id !== res._id;
      } */
      // return resource._id !== res._id || resource.resourceId !== res.resourceId;
    });
  }
}
