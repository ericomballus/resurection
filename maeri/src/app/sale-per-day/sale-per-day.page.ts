import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../services/rest-api.service';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { InventoryService } from '../services/inventory.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-sale-per-day',
  templateUrl: './sale-per-day.page.html',
  styleUrls: ['./sale-per-day.page.scss'],
})
export class SalePerDayPage implements OnInit {
  @ViewChild('mySlider2') slides2: IonSlides;
  data: any;
  invoices: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  total_amount: number = 0;
  total_glace: number = 0;
  total_nonglace: number = 0;
  total_ristourne: number = 0;
  total_quantity: number = 0;
  openCashDate: any;
  isLoading = false;
  totalBu = 0;
  totalBenefice = 0;
  productsItem: any;
  productResto: any;
  vendorRole: Boolean = false;
  queryDate: any;
  multiStoreProductitem = [];
  manageStockWithService: any;
  onvarevenirdessus = false;
  budget = 0;
  constructor(
    public adminService: AdminService,
    private calendar: NgbCalendar,
    public restApiService: RestApiService,
    public loadingController: LoadingController,
    public router: Router,
    public notif: NotificationService,
    public getStoreName: GetStoreNameService,
    public inventoryService: InventoryService,
    private saveRandom: SaverandomService
  ) {
    if (
      JSON.parse(localStorage.getItem('user'))[0] &&
      JSON.parse(localStorage.getItem('user'))[0].venderRole
    ) {
      this.vendorRole = JSON.parse(localStorage.getItem('user'))[0].venderRole;
    }
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
    this.getSetting();
    this.takeCashOpen();
  }
  getSetting() {
    let setting = JSON.parse(localStorage.getItem('setting'));
    console.log(setting);
    if (setting.length) {
      this.manageStockWithService = setting[0]['manageStockWithService'];
    } else {
      if (setting['manageStockWithService']) {
        this.manageStockWithService = setting['manageStockWithService'];
      }
    }
  }
  ngOnInit() {}
  // confirm(row, i){}
  takeInventory() {
    let day;
    let month;
    let year;

    year = `${this.model.year.toString()}`;
    if (this.model.day.toString().length === 1) {
      let jour = this.model.day + 1;
      day = `${jour}`;
    } else {
      let jour = this.model.day + 1;
      day = `${jour}`;
    }

    if (this.model.month.toString().length === 1) {
      month = `${this.model.month}`;
    } else {
      month = `${this.model.month}`;
    }

    let start = new Date(
      this.model.year,
      this.model.month,
      this.model.day
    ).getTime();
    let end = new Date(
      this.model2.year,
      this.model2.month,
      this.model2.day
    ).getTime();

    if (start > end) {
      console.log('impossible');
      this.notif.presentError(
        'Sorry, the start date must be less than the end date',
        'danger'
      );
    } else {
      let d = {};
      d['openDate'] = new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day
      ).toISOString();
      d['closeDate'] = new Date(
        this.model2.year,
        this.model2.month - 1,
        this.model2.day
      ).toISOString();
      //  d["storeId"] = "flprf1619437806029";
      // this.makeInventory(d);
    }
  }

  display(ev) {
    // console.log(this.data);
    let year = new Date(this.data).getFullYear();
    let month = new Date(this.data).getMonth() + 1;
    let day = new Date(this.data).getDate() + 1;

    //year= 2020;
    //month= 05;
    this.adminService
      .getInvoiceByDate2(`${year}-${month}-${day}`)
      // .getInvoiceByDate2(`2020-05-06`)
      .subscribe((data) => {});
  }
  displayDetails(order) {
    console.log(order);
  }

  takeCashOpen() {
    this.notif.presentLoading();
    this.adminService.getOpenCashAll().subscribe(
      (data) => {
        console.log('cash', data);

        if (data['docs'].length) {
          let group = data['docs'].reverse().reduce((r, a) => {
            r[a.storeId] = [...(r[a.storeId] || []), a];
            return r;
          }, {});
          this.multiStoreProductitem = [];
          console.log(group);

          for (const property in group) {
            this.multiStoreProductitem.push(group[property]);
          }
          console.log('group here', this.multiStoreProductitem);
          this.multiStoreProductitem.forEach(async (arr) => {
            let name = await this.getStoreName.takeName(arr);
            arr['storeName'] = name;
          });
          if (
            this.multiStoreProductitem.length &&
            this.saveRandom.getSetting().sale_Gaz
          ) {
            // console.log(this.multiStoreProductitem[0][0]['storeId']);
            let storeId = this.multiStoreProductitem[0][0]['storeId'];
            this.SlideInfo(storeId);
          }
          this.openCashDate = this.multiStoreProductitem;
          this.notif.dismissLoading();
        } else {
          // this.cashDateAlert();
          this.notif.dismissLoading();
          this.notif.presentToast(
            'pas de données disponibles pour le moment',
            'dark'
          );
        }
      },
      (err) => this.notif.dismissLoading()
    );
  }
  del(d) {
    this.adminService.deleteCashOpen(d).subscribe((res) => {
      console.log(res);
      this.takeCashOpen();
    });
  }
  findAll(d, openCashDate) {
    this.queryDate = d;
    localStorage.setItem('dpick', JSON.stringify(d));
    localStorage.setItem('queryDate', JSON.stringify(d));
    let openCashDateId = localStorage.getItem('openCashDateId');
    localStorage.setItem('d', JSON.stringify(d));
    this.saveRandom.setExpensiveAndCash(d);
    if (this.manageStockWithService) {
      if (d.open) {
        localStorage.setItem('open', JSON.stringify(true));
        localStorage.setItem('findThis', JSON.stringify(d));
        this.router.navigateByUrl('display-sale');
      } else {
        this.router.navigateByUrl('display-sale');
      }
    } else {
      this.findAll2(d);
    }
  }

  findAll2(d) {
    localStorage.setItem('d', JSON.stringify(d));
    this.router.navigateByUrl('display-sale');
    return;
    if (d.inventoryalreadyexists) {
    } else {
      this.router.navigateByUrl('before-inventory');
    }
  }
  cleall() {
    this.invoices = '';
    this.totalBu = 0;
    this.totalBenefice = 0;
    this.total_ristourne = 0;
    this.total_amount = 0;
    this.total_glace = 0;
    this.total_nonglace = 0;
    this.total_quantity = 0;
    this.total_ristourne = 0;
  }

  takeProductItems() {
    let tab = [];
    this.restApiService.getProductItem().subscribe((data) => {
      //this.restApiService.getProductList().subscribe(data => {
      console.log(data);
      // this.productsItem = data;
    });
  }

  takeBills(d) {
    this.presentLoading2();
    this.totalBu = 0;
    this.totalBenefice = 0;
    let productItem = [];
    let totalSale = 0;
    let openCashDateId = d._id;
    this.adminService.getBillAggregate(openCashDateId).subscribe((data) => {
      console.log(data);

      this.dismissLoading();
      this.invoices = data['docs'];
      let inventory = [];
      inventory = data['Inventory'];
      console.log(inventory.length);

      this.invoices.forEach((elt) => {
        this.moreInfo(inventory, elt);
        elt['commandes'].forEach((pro) => {
          totalSale = totalSale + pro['commande']['products']['price'];
        });
      });
      console.log('total ====>', totalSale);

      if (this.invoices.length) {
        this.invoices.forEach((elt) => {
          let id = elt['entry'][0]['item']['_id'];
          this.total_amount = this.total_amount + elt['totalSalesAmount'];
          if (elt['glace']) {
            this.total_glace = this.total_glace + elt['glace'];
          }

          if (elt['nonglace']) {
            this.total_nonglace = this.total_nonglace + elt['nonglace'];
          }
          this.total_quantity = this.total_quantity + elt['quantity'];
          elt['ristourneGenerate'] =
            parseInt(elt['_id']['ristourneByProduct']) * elt['quantity'];

          setTimeout(() => {
            let index = elt['entry'].length - 1;

            let benefice =
              elt['entry'][index]['item']['sellingPrice'] -
              elt['entry'][index]['item']['purchasingPrice'];
            //  console.log("benefice", benefice);
            elt['beneficeUnitaire'] = benefice;
            elt['beneficeTotal'] = benefice * elt['quantity'];
            elt['pachat'] = elt['entry'][index]['item']['purchasingPrice'];
            elt['pvente'] = elt['entry'][index]['item']['sellingPrice'];
            this.totalBu = this.totalBu + benefice;
            this.totalBenefice = this.totalBenefice + elt['beneficeTotal'];
            if (elt['ristourneGenerate']) {
              this.total_ristourne =
                parseInt(elt['ristourneGenerate']) + this.total_ristourne;
            } else {
              elt['ristourneGenerate'] = 0;
            }
            // });
          }, 200);
        });
      }
    });
  }

  moreInfo(inventory, elt) {
    return new Promise((resolve, reject) => {
      inventory[0]['listsStart'].forEach((item) => {
        if (item['_id'] == elt['_id']['id']) {
          elt['out'] = elt['quantity'];
          elt['start'] = elt['entry'][0]['item']['quantityStore'];
          elt['reste'] = elt['start'] - elt['out'];
          elt['remaining2'] = 0;
          console.log(elt);
        }
      });

      resolve(elt);
    });
  }

  addIncrement(ev, row) {
    let value = parseInt(ev.target['value']);
    console.log(value);
    console.log(row);
    if (Number.isNaN(value)) {
      console.log(row);
    } else {
      if (value <= row.start) {
        //  row.reste = value;
        //  row.out = row.start - row.reste;
        row.remaining = row.reste - value;
        // row.ristourneGenerate = row.out * row.ristourne;
        // row.totalSalesAmount = row.out * row.pvente;
      } else {
        this.notif.presentToast(
          'quantité invalide supérieur à celle de depart',
          'danger'
        );
      }
    }
  }
  addMore(row) {
    // row["isChecked"] = false;
    console.log(row);
    row['displayQty'] = row['reste'] + 1;
    row['isChecked'] = false;
  }

  getInventory() {
    localStorage.setItem('queryDate', JSON.stringify(this.queryDate));
    this.router.navigateByUrl('display-sale');
    /* this.adminService.getAdminInventory().subscribe((data) => {
      this.router.navigateByUrl("display-inventaire");
      console.log(data);
    });*/
  }
  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 60000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
  saveAll() {}
  async slideChange() {
    console.log('====slide change here===');
    try {
      let index = await this.slides2.getActiveIndex();
      console.log(index);

      let storeId = this.multiStoreProductitem[index][0][0]['storeId'];
      console.log(storeId);
      // this.getSlideInfo.emit(storeId);
    } catch (error) {}
  }
  SlideInfo(storeId) {
    let storeList: any[] = this.saveRandom.getStoreList();
    let store = storeList.find((s) => s.id == storeId);

    if (store && this.saveRandom.getSetting().sale_Gaz) {
      if (store.reste) {
        this.budget = store.reste;
      } else if (store.budget) {
        this.budget = store.budget;
      } else {
        this.budget = 0;
      }
      console.log(this.budget);
    }
  }
}
