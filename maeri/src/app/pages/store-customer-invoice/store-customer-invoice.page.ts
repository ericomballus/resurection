import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ScreensizeService } from 'src/app/services/screensize.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { ManagesocketService } from '../../services/managesocket.service';
@Component({
  selector: 'app-store-customer-invoice',
  templateUrl: './store-customer-invoice.page.html',
  styleUrls: ['./store-customer-invoice.page.scss'],
})
export class StoreCustomerInvoicePage implements OnInit {
  invoicesList: any[];
  isDesktop: boolean;
  public mysockets;
  constructor(
    public modalController: ModalController,
    private saveRandom: SaverandomService,
    public screensizeService: ScreensizeService,
    private translateConfigService: TranslateConfigService,
    private manageSocket: ManagesocketService
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.screenCheck();
  }

  ionViewWillEnter() {
    this.webServerSocket();
    this.invoicesList = this.saveRandom.getCustomerInvoices();
  }

  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
          // Reload because our routing is out of place
          //  window.location.reload();
        }

        this.isDesktop = isDesktop;
      });
    }, 10);
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    console.log(lang);

    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  async displayDetails(order) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        order2: order,
        Pos: false,
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }
  webServerSocket() {
    let id = localStorage.getItem('adminId');
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}newBill`, async (data) => {
        this.invoicesList.filter((elt) => {
          return elt._id !== data.invoicesId;
        });
      });

      sockets.on(`${id}newInvoiceChange`, (data) => {
        let index = this.invoicesList.findIndex((elt) => {
          return elt._id === data._id;
        });

        if (index >= 0) {
          this.invoicesList.splice(index, 1, data);
        }
      });
    });
  }
}
