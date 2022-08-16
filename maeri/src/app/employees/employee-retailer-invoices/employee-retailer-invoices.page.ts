import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { InvoicesService } from 'src/app/services/invoices.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-employee-retailer-invoices',
  templateUrl: './employee-retailer-invoices.page.html',
  styleUrls: ['./employee-retailer-invoices.page.scss'],
})
export class EmployeeRetailerInvoicesPage implements OnInit {
  invoicesList: any[] = [];
  products: any[] = [];
  totalAmount = 0;
  reste = 0;
  isDetail = false;
  longueurLigne = 0;
  totalImpaye = 0;
  constructor(
    private modalController: ModalController,
    private saveRandom: SaverandomService,
    private inv: InvoicesService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.getRetailerInvoice();
  }
  closeModal() {
    this.modalController.dismiss();
  }

  getRetailerInvoice() {
    this.notifi.presentLoading();
    this.inv
      .getInvoiceNotPaie(this.saveRandom.getRetailer()['_id'])
      .subscribe((invoices) => {
        this.notifi.dismissLoading();

        this.invoicesList = invoices['docs'];

        this.invoicesList.forEach((inv) => {
          if (!inv['sale'] && !inv['invoiceCancel']) {
            if (inv['trancheList'].length) {
              let montAvance = 0;
              inv['trancheList'].forEach((tranche) => {
                montAvance += tranche['montant'];
              });
              let total = 0;
              inv['commandes'].forEach((com) => {
                total += com['cartdetails']['totalPrice'];
              });
              let reste = total - montAvance;
              if (reste > 0) {
                inv['sale'] = false;
                this.totalImpaye += reste;
              } else if (reste <= 0) {
                inv['sale'] = true;
              }
            } else {
              let total = 0;
              inv['commandes'].forEach((com) => {
                total += com['cartdetails']['totalPrice'];
              });
              this.totalImpaye += total;
            }
          }
        });
      });
  }

  async displayDetail(invoice) {
    /* this.products = invoice.commande.products;
    this.totalAmount = invoice.commande.cartdetails.totalPrice;
    this.reste = invoice.commande.reste;
    this.isDetail = true;*/
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: invoice,
        order2: invoice,
        manager: true,
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      if (data['data'] === 'cancel invoice') {
      }
    });
    return await modal.present();
  }

  closeDetail() {
    this.isDetail = false;
  }
}
