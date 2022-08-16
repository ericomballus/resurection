import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DetailsPage } from '../point-of-sale/details/details.page';
import { IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { SaverandomService } from '../services/saverandom.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-invoice-unpaid',
  templateUrl: './invoice-unpaid.page.html',
  styleUrls: ['./invoice-unpaid.page.scss'],
})
export class InvoiceUnpaidPage implements OnInit {
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
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    public actionSheet: ActionSheetController
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
    /* const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        flags: true,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();*/
  }

  loadData(event) {}
  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  getOrders() {}
  manageInvoice(order) {
    this.notifi
      .presentAlertConfirm(
        `confirmer la paiement de la facture ${order.numFacture} ?`,
        'oui',
        'non'
      )
      .then(() => {
        this.notifi.presentLoading();
        if (
          order.commande.montantRecu >= order.commande.cartdetails.totalPrice &&
          order.commande.confirmPaie
        ) {
          order.sale = true;
          order.cash = true;
        }
        this.adminService.buyAndUpdateOrder(order).subscribe(
          (res) => {
            this.notifi.dismissLoading();
            if (res && res['delete']) {
              this.notifi
                .presentAlertConfirm(
                  ` ${res['message']} la supprimée ?`,
                  'oui',
                  'non'
                )
                .then(() => {
                  this.notifi.presentLoading();
                  this.adminService.deleteOrder(order).subscribe((res) => {
                    this.invoices = this.invoices.filter(
                      (inv) => inv._id !== order._id
                    );
                    this.notifi.dismissLoading();
                    this.notifi.presentToast(res['message'], 'primary');
                  });
                });
            }
            console.log('response', res);
          },
          (error) => {
            console.log('error send', error);
          }
        );
      });
  }

  deleteOrder(order) {
    this.notifi
      .presentAlertConfirm('Voulez vous vraiment supprimer?', 'Yes', 'No')
      .then(() => {
        let productTab = [];
        order.invoiceCancel = true;
        this.notifi.presentLoading();
        order['commandes'].forEach((elt) => {
          if (productTab.length) {
            productTab = [...productTab, ...elt['products']];
          } else {
            productTab = elt['products'];
          }
        });
        this.adminService
          .cancelOrder2(order.localId, productTab, order)
          .subscribe(
            (data) => {
              this.notifi.dismissLoading();
              this.notifi.presentToast('facture supprimée', 'primary');
              this.invoices = this.invoices.filter(
                (inv) => inv._id !== order._id
              );
            },
            (err) => {
              console.log(err);
              this.notifi.dismissLoading().then(() => {});
            }
          );
      })
      .catch(() => {});
  }

  async presentActionSheet(order) {
    const actionSheet = await this.actionSheet.create({
      header: '',
      buttons: [
        {
          text: 'Payer ?',
          icon: 'share',
          handler: () => {
            this.manageInvoice(order);
          },
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteOrder(order);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
