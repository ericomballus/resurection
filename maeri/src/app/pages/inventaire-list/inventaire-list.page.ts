import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../../services/rest-api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { GetStoreNameService } from '../../services/get-store-name.service';
import { InventoryService } from '../../services/inventory.service';
import { ManagerInventoryService } from 'src/app/services/manager-inventory.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-inventaire-list',
  templateUrl: './inventaire-list.page.html',
  styleUrls: ['./inventaire-list.page.scss'],
})
export class InventaireListPage implements OnInit {
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
  multiStoreInventory: any;
  manageStockWithService: any;
  cashOpened: Boolean;
  onvarevenirdessus = false;
  constructor(
    public adminService: AdminService,
    private calendar: NgbCalendar,
    public restApiService: RestApiService,
    public loadingController: LoadingController,
    public router: Router,
    public notif: NotificationService,
    public inventoryService: InventoryService,
    public alertController: AlertController,
    private managerService: ManagerInventoryService,
    private rangeByStoreService: RangeByStoreService,
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
    //  this.getSetting();
    this.getInventory();
  }
  getSetting() {
    let setting = JSON.parse(localStorage.getItem('setting'));
    console.log(setting);
    if (setting.length) {
      this.manageStockWithService = setting[0]['manageStockWithService'];
    } else {
      if (setting['manageStockWithService']) {
        //console.log(setting["manageStockWithService"]);

        this.manageStockWithService = setting['manageStockWithService'];
      }
    }
  }
  ngOnInit() {}
  ionViewWillEnter() {
    this.getInventory();
  }
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
      this.makeInventory(d);
    }
  }

  getInventory() {
    this.managerService.getInventory().subscribe(async (result: any) => {
      if (result.length == 1 && result[0]['Inventory'].length == 0) {
      } else {
        this.multiStoreInventory =
          await this.rangeByStoreService.rangeProductByStore(result);
        console.log(this.multiStoreInventory);
      }
    });
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

  makeInventory(d) {
    //  this.router.navigateByUrl("before-inventory");
    this.presentLoading2();
    this.restApiService.getProductItemForInventory(d).subscribe((res) => {
      console.log(res);
      this.inventoryService.setInventoryList(res);
      this.router.navigateByUrl('build-display-inventory');
      this.dismissLoading()
        .then((res) => {})
        .catch((err) => console.log(err));
    });
  }
  buildInventory() {
    let setting = this.saveRandom.getSetting();
    console.log(setting);

    this.router.navigateByUrl('before-inventory');
  }
  displayInventory(data) {
    this.inventoryService.setInventoryList(data.Inventory);
    this.inventoryService.setCash(data.cashClose);
    this.router.navigateByUrl('build-display-inventory');
  }
}
