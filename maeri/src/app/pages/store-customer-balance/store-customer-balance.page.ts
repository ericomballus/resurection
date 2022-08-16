import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Balance } from 'src/app/models/balance';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { CustomerService } from 'src/app/services/customer.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ScreensizeService } from 'src/app/services/screensize.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { ManagesocketService } from '../../services/managesocket.service';
@Component({
  selector: 'app-store-customer-balance',
  templateUrl: './store-customer-balance.page.html',
  styleUrls: ['./store-customer-balance.page.scss'],
})
export class StoreCustomerBalancePage implements OnInit {
  balanceList: Balance[] = [];
  isDesktop: boolean;
  public mysockets;
  amount = 0;
  customer: any = {};
  constructor(
    public modalController: ModalController,
    private saveRandom: SaverandomService,
    public screensizeService: ScreensizeService,
    private translateConfigService: TranslateConfigService,
    private manageSocket: ManagesocketService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.screenCheck();
  }

  ionViewWillEnter() {
    //this.webServerSocket();
    this.customer = this.saveRandom.getData();
    this.getBalanceList(this.customer._id);
  }

  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
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

  webServerSocket() {
    let id = localStorage.getItem('adminId');
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}newBill`, async (data) => {
        this.balanceList.filter((elt) => {
          return elt._id !== data.invoicesId;
        });
      });

      sockets.on(`${id}newInvoiceChange`, (data) => {
        let index = this.balanceList.findIndex((elt) => {
          return elt._id === data._id;
        });

        if (index >= 0) {
          this.balanceList.splice(index, 1, data);
        }
      });
    });
  }
  getBalanceList(id) {
    this.customerService.getCustomerBalance(id).subscribe((data: Balance[]) => {
      this.balanceList = data;
      console.log(this.balanceList);
    });
  }
  updateAmount() {
    let data: any = {};
    // data.amount= this.amount;
    data.amountRecharge = this.amount;
    data.customerId = this.customer._id;
    data.recharge = true;

    if (this.balanceList.length) {
      let old = this.balanceList[0];
      data.amount = old.amount + this.amount;
    } else {
      data.amount = this.amount;
    }
    console.log(data);
    this.customerService.postBalance(data).subscribe((res) => {
      console.log(res);
      this.amount = 0;
      this.getBalanceList(this.customer._id);
    });
  }
}
