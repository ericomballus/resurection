import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { PrintService } from 'src/app/print.service';
import { PrinterService } from 'src/app/services/printer.service';

import { Buffer } from 'buffer/';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-display-invoice',
  templateUrl: './display-invoice.page.html',
  styleUrls: ['./display-invoice.page.scss'],
})
export class DisplayInvoicePage implements OnInit {
  @ViewChild('myBill', { static: false }) public myBill: ElementRef;
  order: any;
  buffer: Buffer;
  flag: boolean = false;
  tabRoles = [];
  manager: boolean = false;
  status: boolean;
  sum: any;
  montantR = 0;
  reste = 0;
  userName: any;
  company: any;
  tableNumber: number = 0;
  factories = [];
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    private adminService: AdminService,
    private printService: PrinterService,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService
  ) {
    console.log(navParams.get('order'));
    this.languageChanged();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.order = navParams.get('order');
    this.factories = this.order['products'];
    this.sum = this.order['commande']['cartdetails']['totalPrice'];
    this.tableNumber = this.order['tableNumber'];

    if (this.order['commande']['montantRecu']) {
      this.montantR = this.order['commande']['montantRecu'];
    } else {
      this.montantR = 0;
    }

    if (this.order['commande']['reste']) {
      this.reste = this.order['commande']['reste'];
    } else {
      this.reste = 0;
    }

    this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    this.company = localStorage.getItem('company');

    console.log(navParams.get('order'));
    if (navParams.get('flags')) {
      this.flag = true;
    }
    if (navParams.get('Pos')) {
      this.flag = true;
    } else {
      this.flag = false;
    }
    if (this.tabRoles.includes(2)) {
      this.manager = true;
    }
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss('no_update');
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
}
