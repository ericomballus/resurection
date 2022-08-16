import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from '../point-of-sale/details/details.page';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-invoice-cancel',
  templateUrl: './invoice-cancel.page.html',
  styleUrls: ['./invoice-cancel.page.scss'],
})
export class InvoiceCancelPage implements OnInit {
  invoices = [];
  tabRoles = [];
  admin: boolean = false;
  manager: boolean = false;
  numPage = 0;
  nbrPages = 0;
  traduction: boolean = false;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;

  constructor(
    private adminService: AdminService,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private saveRandom: SaverandomService
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.getInvoice();
  }

  getInvoice() {
    this.invoices = this.saveRandom.getCustomerInvoices();
    console.log(this.invoices);
  }
  async displayDetails(order) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        flags: true,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  loadData(event) {
    let num = this.numPage + 1;
    console.log(this.invoices.length);
    if (num > this.nbrPages) {
      event.target.disabled = true;
      return;
    }
  }
  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
}
