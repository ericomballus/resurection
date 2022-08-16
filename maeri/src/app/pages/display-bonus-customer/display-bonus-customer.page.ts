import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import { GroupByCategorieService } from 'src/app/services/group-by-categorie.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-display-bonus-customer',
  templateUrl: './display-bonus-customer.page.html',
  styleUrls: ['./display-bonus-customer.page.scss'],
})
export class DisplayBonusCustomerPage implements OnInit {
  data: any;
  invoices: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  openCashDate: any;
  queryDate: any;
  customerList = [];
  bonusTab = [];
  constructor(
    private calendar: NgbCalendar,
    public notif: NotificationService,
    private adminService: AdminService,
    private saveRandom: SaverandomService,
    private groupByService: GroupByCategorieService
  ) {}

  ngOnInit() {
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
    this.customerList = this.saveRandom.getCustomerList();
    console.log(this.customerList);
  }

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
      d['start'] = new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day + 1
      ).toISOString();
      d['end'] = new Date(
        this.model2.year,
        this.model2.month - 1,
        this.model2.day + 1
      ).toISOString();
      if (d['start'] == d['end']) {
        d['start'] = new Date(
          this.model.year,
          this.model.month - 1,
          this.model.day
        ).toISOString();
      }
      console.log(d);
      this.adminService.getInvoiceBonus(d).subscribe((data) => {
        this.groupByService.groupByCustomerId(data['docs']).then((resultat) => {
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
              console.log(this.bonusTab);
            }
          });
        });
      });
    }
  }
}
