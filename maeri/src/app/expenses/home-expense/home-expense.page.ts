import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseService } from 'src/app/services/expense.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-home-expense',
  templateUrl: './home-expense.page.html',
  styleUrls: ['./home-expense.page.scss'],
})
export class HomeExpensePage implements OnInit {
  categories: any[] = [];
  expensesList: any[] = [];
  response = false;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  destroy$ = new Subject();
  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private saveRandom: SaverandomService,
    private calendar: NgbCalendar,
    private notifi: NotificationService,
    private actionSheet: ActionSheetController,
    public alertController: AlertController,
    public adminService: AdminService
  ) {
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.getCategorie();
    this.getExpense();
    this.takeCashOpen();
  }
  addExpenses() {
    this.router.navigateByUrl(`/add-expense?page=expense.page`);
  }
  addCategorie() {
    this.router.navigateByUrl(`/categorie-expense?page=expense.page`);
  }

  getCategorie() {
    this.expenseService.getExpenseCategories().subscribe((docs: any) => {
      console.log(docs);
      this.categories = docs;
      this.expenseService.setCategorie(docs);
    });
  }

  getExpense() {
    let storeList: any[] = this.saveRandom.getStoreList();
    this.expenseService.getExpense().subscribe((docs: any[]) => {
      console.log(docs);
      this.response = true;
      this.assignStore(docs);
    });
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
      this.notifi.presentError(
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
      this.expenseService.getExpenseByDate(d).subscribe(
        (docs: any[]) => {
          if (docs.length) {
            // this.expensesList = docs;
            this.assignStore(docs);
          } else {
            this.notifi.presentToast(
              'aucun resultat disponible pour votre recherche',
              'primary'
            );
          }
        },
        (err) => {
          this.notifi.presentToast('une erreur est survenue !', 'danger');
        }
      );
    }
  }
  assignStore(docs) {
    let storeList = this.saveRandom.getStoreList();

    for (const doc of docs) {
      for (const store of storeList) {
        if (store.id == doc.storeId) {
          doc['storeName'] = store.name;
        }
      }
    }
    this.expensesList = docs;
  }
  displayDescription(doc) {
    doc.open = !doc.open;
  }

  async presentActionSheet(p, i) {
    if (p.open) {
      p.open = !p.open;
      return;
    }
    const actionSheet = await this.actionSheet.create({
      header: '',
      buttons: [
        {
          text: 'Description',
          icon: 'share',
          handler: () => {
            this.displayDescription(p);
          },
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentAlertConfirm(p, i);
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

  async presentAlertConfirm(p, i) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Voulez vous supprimer ?`,
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'OUI',
          handler: () => {
            this.removePurchase(p, i);
          },
        },
      ],
    });

    await alert.present();
  }

  removePurchase(doc, i) {
    this.notifi.presentLoading();
    this.expenseService.deleteExpense(doc).subscribe((res) => {
      this.notifi.dismissLoading();
      this.expensesList.splice(i, 1);
    });
  }
  takeCashOpen() {
    // let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let storeId = this.saveRandom.getStoreId();
    this.adminService
      .getOpenCash()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('cash id here ===>', data);
        if (data['docs'].length > 0) {
          localStorage.setItem(
            'openCashDateObj',
            JSON.stringify(data['docs'][0])
          );
          localStorage.setItem('openCashDateId', data['docs'][0]['_id']);
          let openId = JSON.parse(localStorage.getItem('openCashDateObj'))[
            '_id'
          ];
        } else {
          // this.presentToast('PLEASE OPEN CASH!');
        }
      });
  }
}
