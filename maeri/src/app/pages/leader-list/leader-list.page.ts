import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { AddStoreCustomerPage } from '../add-store-customer/add-store-customer.page';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { UpdateStoreCustomerPage } from '../update-store-customer/update-store-customer.page';
import { DisplayStoreCustomerPage } from '../display-store-customer/display-store-customer.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { ManagesocketService } from 'src/app/services/managesocket.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { Invoice } from 'src/app/models/invoice';
import { GroupByCategorieService } from 'src/app/services/group-by-categorie.service';

@Component({
  selector: 'app-leader-list',
  templateUrl: './leader-list.page.html',
  styleUrls: ['./leader-list.page.scss'],
})
export class LeaderListPage implements OnInit {
  customerList = [];
  leaderList = [];
  public sockets;
  url: any;
  useBonus: Boolean = false;
  clients = [];
  tab = [];
  bonusTab = [];
  constructor(
    public modalController: ModalController,
    private adminService: AdminService,
    public urlService: UrlService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    private manageSocket: ManagesocketService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private router: Router,
    private groupByService: GroupByCategorieService
  ) {}

  ngOnInit() {
    this.leaderList = this.saveRandom.getData();
    console.log(this.leaderList);
    /* this.customerList.forEach((customer, index) =>
      this.getCustomerInvoices(customer._id)
    );*/
    this.customerList = this.saveRandom.getCustomerList();
  }

  manageCustumer(customer) {
    //this.saveRandom.setCustomerInvoices[]
    // this.customer
    this.notifi.presentLoading();
    this.getCustomerInvoices(customer._id);
  }

  getCustomerInvoices(customerId) {
    console.log('la list', this.customerList);
    let clients = this.customerList.filter(
      (elt) => elt.chefEquipe == customerId
    );
    this.clients = [];
    this.tab = [];
    this.clients = clients;

    if (this.clients.length) {
      this.clients.forEach((cl, index) => {
        this.getInvoice(cl._id, index);
      });
    } else {
      this.notifi.dismissLoading();
    }
  }
  getInvoice(customerId, index) {
    this.adminService
      .getInvoiceByCustomer(customerId)
      .subscribe((docs: any[]) => {
        this.tab = [...this.tab, ...docs];
        if (this.clients.length - 1 == index) {
          this.groupByService.groupByCustomerId(this.tab);

          this.groupByService.groupByCustomerId(this.tab).then((resultat) => {
            console.log(resultat);
            this.bonusTab = [];
            resultat.forEach((arr) => {
              let customerId = arr[0]['customerId'];

              let client = this.customerList.find((customer) => {
                return customer._id == customerId;
              });

              if (client) {
                let bonus = 0;
                arr.forEach((elt) => {
                  elt['commandes'].forEach((com) => {
                    com['products'].forEach((prod) => {
                      bonus = prod.item.bonus + bonus;
                    });
                  });
                });
                arr;
                let obj = { client: client, data: arr, bonus: bonus };
                this.bonusTab.push(obj);
              }
            });
            this.notifi.dismissLoading();
            this.saveRandom.setCustomerInvoices(this.bonusTab);
            this.router.navigateByUrl('leader-bonus');
          });

          /*  */
        }
      });
  }
}
