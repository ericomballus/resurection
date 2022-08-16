import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
//import { Router } from "@angular/router";
import {
  NavParams,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import { NotificationService } from '../services/notification.service';
import { CreatestorePage } from '../pages/createstore/createstore.page';
import { UpdatestorePage } from '../pages/updatestore/updatestore.page';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.page.html',
  styleUrls: ['./customer-modal.page.scss'],
})
export class CustomerModalPage implements OnInit {
  custumer: any;
  userStore = [];
  companyTypes = [
    { name: 'bar' },
    { name: 'resto' },
    { name: 'services' },
    { name: 'shop' },
    { name: 'Gaz' },
    { name: 'Hospital' },
  ];

  userRole: Boolean = false;
  resource: Boolean = false;
  manageStockWithService: Boolean = false;
  custumerSetting: any;
  newpassword: any;
  wifi: Boolean = false;
  cmp = 0;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public notif: NotificationService,
    private adminService: AdminService, // private router: Router
    private restApi: RestApiService
  ) {
    this.custumer = navParams.get('custumer');
    if (this.custumer['storeId']) {
      this.userStore = this.custumer['storeId'];
    }
    if (!this.custumer['montant']) {
      this.custumer['montant'] = 0;
    }
    let a;
    if (this.custumer['email']) {
      a = this.custumer['email'].split('@');
    }
    if (a.length) {
    }

    // this.getAllOrderUser(db);
    this.getSetting();
  }

  ngOnInit() {}

  takeMaeriProducts() {
    this.restApi.getMaeriProductAdmin().subscribe((data) => {
      console.log(data);
    });
  }

  update(form) {
    this.custumer['venderRole'] = this.userRole;
    if (this.newpassword) {
      this.custumer['newpassword'] = this.newpassword;
    }

    //setInterval(() => {
    /* for (let index = 0; index < 50; index++) {
        console.log('compteur value is =====>', this.cmp);
        this.adminService.updateCustomer(this.custumer).subscribe(
          (data) => {
            this.cmp = this.cmp + 1;
            this.updateCompanySetting();
            this.getSetting();
            this.takeMaeriProducts();
          },
          (err) => console.log(err)
        );
      }
    }, 1000);*/

    this.adminService.updateCustomer(this.custumer).subscribe((data) => {
      this.updateCompanySetting();
      this.modalController.dismiss('erico');
    });
  }
  updateWithoutExit() {
    this.adminService.updateCustomer(this.custumer).subscribe((data) => {
      this.updateCompanySetting();
    });
  }
  closeModal() {
    this.modalController.dismiss('erico');
  }

  test(ev: Event) {
    if (ev.target['value'] === 'true') {
      this.custumer.autorization = true;
    } else {
      this.custumer.autorization = false;
    }
  }

  getInvoiceUser(db, userId) {
    this.adminService.getInvoicePaieSudo(db, userId).subscribe((data) => {});
  }

  getAllOrderUser(db) {
    this.adminService.getAllOrderSudo(db).subscribe((data) => {});
  }

  async addStore() {
    const modal = await this.modalController.create({
      component: CreatestorePage,
      componentProps: {},
    });
    modal.onDidDismiss().then((res) => {
      if (res['data'] == 'close') {
      } else {
        let idL =
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5) +
          this.custumer['_id'] +
          Date.now();
        let store = {};
        if (this.custumer['storeId']) {
          let obj = { numStore: this.custumer['storeId'].length + 1, id: idL };
          store = { ...obj, ...res['data'] };
        } else {
          let obj = { numStore: 1, id: idL };
          store = { ...obj, ...res['data'] };
        }

        this.userStore.push(store);
        this.custumer['storeId'] = this.userStore;
        this.updateWithoutExit();
      }
    });
    return await modal.present();
  }

  async updateStore(store) {
    const modal = await this.modalController.create({
      component: UpdatestorePage,
      componentProps: { store: store },
    });
    modal.onDidDismiss().then((res) => {
      if (res['data']) {
        let store = res['data'];
        let index = this.custumer['storeId'].findIndex((str) => {
          return str.id == store.id;
        });

        if (index >= 0) {
          this.custumer['storeId'].splice(index, 1, store);
          this.updateWithoutExit();
        }
      }
    });
    return await modal.present();
  }
  removeStore(store) {
    console.log(store);
    this.userStore = this.custumer['storeId'].filter((elt) => {
      return elt.id != store.id;
    });
    this.custumer['storeId'] = this.userStore;
    this.updateWithoutExit();
  }

  logValue(ev) {
    if (ev.detail.value === 'v') {
      this.userRole = true;
      this.custumer['venderRole'] = true;
    } else {
      this.userRole = false;
      this.custumer['venderRole'] = false;
    }
  }

  enableResource() {
    this.resource = !this.resource;

    this.custumerSetting['use_resource'] = this.resource;
  }
  enableGestionStock() {
    this.manageStockWithService = !this.manageStockWithService;
    this.custumerSetting['manageStockWithService'] =
      this.manageStockWithService;
  }

  updateCompanySetting() {
    let aut = 0;

    this.adminService
      .adminMaeriCustumerUpdateCompanySetting(
        this.custumerSetting,
        this.custumer['_id']
      )
      .subscribe(
        (data) => {
          // console.log(data);
        },
        (err) => console.log(err)
      );
  }
  getSetting() {
    this.adminService
      .adminMaeriCustumerCompanySetting(this.custumer['_id'])
      .subscribe(
        (data) => {
          if (data['company'].length) {
            this.custumerSetting = data['company'][0];

            this.manageStockWithService =
              this.custumerSetting['manageStockWithService'];
            this.resource = this.custumerSetting['use_resource'];
          }
        },
        (err) => console.log(err)
      );
  }
  enableWifi() {
    // this.wifi = !this.wifi;
    // console.log(this.wifi);
    this.custumerSetting['use_wifi'] = !this.custumerSetting['use_wifi'];
    if (this.custumerSetting['use_desktop']) {
      this.custumerSetting['use_desktop'] =
        !this.custumerSetting['use_desktop'];
    }
  }
  enableDesktop() {
    this.custumerSetting['use_desktop'] = !this.custumerSetting['use_desktop'];
    // desable wifi
    if (this.custumerSetting['use_wifi']) {
      this.custumerSetting['use_wifi'] = !this.custumerSetting['use_wifi'];
    }
  }
  enablePosLive() {
    this.custumerSetting['use_pos_live'] =
      !this.custumerSetting['use_pos_live'];
  }

  enableMultiStore() {
    this.custumerSetting['multi_store'] = !this.custumerSetting['multi_store'];
  }
  enableSaleToRetailer() {
    this.custumerSetting['saleToRetailer'] =
      !this.custumerSetting['saleToRetailer'];
  }
  enableCustomerOrdered() {
    this.custumerSetting['check_customer_ordered'] =
      !this.custumerSetting['check_customer_ordered'];
  }
  enableSaleInPack() {
    this.custumerSetting['SaleInPack'] = !this.custumerSetting['SaleInPack'];
    this.custumerSetting['SaleAsPack'] = !this.custumerSetting['SaleAsPack'];
  }
  enableUseBonus() {
    this.custumerSetting['use_bonus'] = !this.custumerSetting['use_bonus'];
  }
  enableUseConsigne() {
    this.custumerSetting['use_Consigne'] =
      !this.custumerSetting['use_Consigne'];
  }
  enableReset() {
    this.custumerSetting['reset_product'] =
      !this.custumerSetting['reset_product'];
  }

  enableUseGamme() {
    this.custumerSetting['use_gamme'] = !this.custumerSetting['use_gamme'];
  }

  enableNumeroTable() {
    this.custumerSetting['use_TableNumber'] =
      !this.custumerSetting['use_TableNumber'];
  }
  enableChangePrice() {
    this.custumerSetting['change_price'] =
      !this.custumerSetting['change_price'];
  }
  enableLocalServer() {
    if (this.custumerSetting['use_CloudServer']) {
      this.custumerSetting['use_CloudServer'] =
        !this.custumerSetting['use_CloudServer'];
    }
    this.custumerSetting['use_LocalServer'] =
      !this.custumerSetting['use_LocalServer'];
  }

  enableCloudServer() {
    if (this.custumerSetting['use_LocalServer']) {
      this.custumerSetting['use_LocalServer'] =
        !this.custumerSetting['use_LocalServer'];
    }

    this.custumerSetting['use_CloudServer'] =
      !this.custumerSetting['use_CloudServer'];
  }

  enableCloudAndLocal() {
    if (this.custumerSetting['use_LocalServer']) {
      this.custumerSetting['use_LocalServer'] = false;
    }
    if (this.custumerSetting['use_CloudServer']) {
      this.custumerSetting['use_CloudServer'] = false;
    }

    this.custumerSetting['use_CloudAndLocal'] =
      !this.custumerSetting['use_CloudAndLocal'];
  }
  enableCheckResource() {
    this.custumerSetting['check_resource'] =
      !this.custumerSetting['check_resource'];
  }
  enableCheckQuantity() {
    this.custumerSetting['check_service_quantity'] =
      !this.custumerSetting['check_service_quantity'];
  }

  enableCheckProduct() {
    this.custumerSetting['check_products_quantity'] =
      !this.custumerSetting['check_products_quantity'];
  }
  enableCheckBar() {
    this.custumerSetting['check_bar_quantity'] =
      !this.custumerSetting['check_bar_quantity'];
  }
  enableCheckList() {
    this.custumerSetting['check_List_quantity'] =
      !this.custumerSetting['check_List_quantity'];
  }
  enableGazProduct() {
    this.custumerSetting['check_Gaz_quantity'] =
      !this.custumerSetting['check_Gaz_quantity'];
  }
  enableRistourne() {
    this.custumerSetting['use_Ristourne'] =
      !this.custumerSetting['use_Ristourne'];
  }
  enableUseSameVariety() {
    //elle va permettre de créer automatiquement les meme variété de produits dans plusieurs store
    this.custumerSetting['use_same_variety'] =
      !this.custumerSetting['use_same_variety'];
  }
  enablePourcentage() {
    this.custumerSetting['employePercentPrice'] =
      !this.custumerSetting['employePercentPrice'];
  }
  enableResellerPourcentage() {
    this.custumerSetting['ResellerPercentPrice'] =
      !this.custumerSetting['ResellerPercentPrice'];
  }
  enableCustomerPourcentage() {
    this.custumerSetting['customerPercentPrice'] =
      !this.custumerSetting['customerPercentPrice'];
  }
  enableProductionRefueling() {
    //ravitaillement depuis la magasin de la production
    this.custumerSetting['refueling_from_warehouse_production'] =
      !this.custumerSetting['refueling_from_warehouse_production'];
  }
  shipPackages() {
    this.custumerSetting['ship_packages'] =
      !this.custumerSetting['ship_packages']; // expedition des colis
  }
  manageExpense() {
    this.custumerSetting['manage_expenses'] =
      !this.custumerSetting['manage_expenses'];
  }
  saleGaz() {
    this.custumerSetting['sale_Gaz'] = !this.custumerSetting['sale_Gaz'];
  }
  pickCompanyType(ev) {
    this.custumer.storeType = ev.detail.value;
    if (ev.detail.value === 'Gaz') {
      this.custumerSetting['sale_Gaz'] = true;
    } else {
      this.custumerSetting['sale_Gaz'] = false;
    }

    if (ev.detail.value === 'Hospital') {
      this.custumerSetting['is_Hospital'] = true;
    }
  }
  isHospital() {
    this.custumerSetting['is_Hospital'] = !this.custumerSetting['is_Hospital'];
  }
  registerCustomer() {
    this.custumerSetting['register_customer'] =
      !this.custumerSetting['register_customer'];
  }
  pickDisplayType(ev) {
    this.custumerSetting.displayType = ev.detail.value;
    this.custumer.displayType = ev.detail.value;
  }

  async presentActionSheet(store) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Update',
          icon: 'share',
          handler: () => {
            this.updateStore(store);
          },
        },

        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeStore(store);
          },
        },

        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }
}
