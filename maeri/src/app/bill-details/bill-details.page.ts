import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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
  selector: 'app-bill-details',
  templateUrl: './bill-details.page.html',
  styleUrls: ['./bill-details.page.scss'],
})
export class BillDetailsPage implements OnInit {
  bill: any;
  products: any[] = [];
  productsRandom: any[] = [];
  toRemove: Product[] = [];
  facture: Bill;
  randomObj = {};
  gammeList = {};
  toRemoveArr: any[] = [];
  productsRestant: Product[] = [];
  priceArr: number[] = [];
  desableBtn: boolean = false;
  EmployesList: any[] = [];
  Employe: any;
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
    console.log(this.bill);
    this.facture = this.saveRandom.getData();
    if (
      this.bill.partiallyCancel ||
      this.bill.purchaseOrder.length ||
      this.toRemoveArr.length
    ) {
      this.desableBtn = true;
    }
    //recupére tous les produits de la commande
    this.getEmployeList();
    this.init();
  }
  init() {
    let objRandom = {};
    if (this.bill.employeId) {
      console.log('employe id here, ===>', this.bill.employeId);

      if (this.EmployesList.length) {
        this.Employe = this.EmployesList.find(
          (emp) => emp._id == this.bill.employeId
        );
        console.log(this.Employe);
      }
    }
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
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  getEmployeList() {
    this.EmployesList = this.saveRandom.getEmployeList();
    console.log('employe list====>', this.EmployesList);
  }
}
