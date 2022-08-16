import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Admin } from 'src/app/models/admin.model';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ContratService } from 'src/app/services/contrat.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Contrat } from 'src/app/models/contrat.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-contrat',
  templateUrl: './update-contrat.page.html',
  styleUrls: ['./update-contrat.page.scss'],
})
export class UpdateContratPage implements OnInit {
  admin: Admin;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  contrat: Contrat;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  constructor(
    private randomStorage: SaverandomService,
    private modal: ModalController,
    private calendar: NgbCalendar,
    public notif: NotificationService,
    public contratService: ContratService,
    private location: Location
  ) {}

  ngOnInit() {
    this.admin = this.randomStorage.getUserAdmin();
    this.contrat = this.randomStorage.getContrat();
    console.log(this.admin);
    this.startDate = this.calendar.getToday();
    this.endDate = this.calendar.getToday();
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
  }

  async update() {
    if (this.model && this.model !== this.startDate) {
      // let d= await this.getDate(this.model)
      this.contrat.startAt = new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day
      ).toISOString();
    }

    if (this.model2 && this.model2 !== this.endDate) {
      // let d= await this.getDate(this.model)
      this.contrat.endAt = new Date(
        this.model2.year,
        this.model2.month - 1,
        this.model2.day
      ).toISOString();
    }

    this.contratService.updateContrat(this.contrat).subscribe(
      (data) => {
        this.notif.presentToast('update successful!!!', 'success');
        this.location.back();
      },
      (err) => {
        this.notif.presentToast('update failed !!!', 'danger');
      }
    );
  }

  getDate(model): Promise<any> {
    return new Promise((resolve, reject) => {
      let day;
      let month;
      let year;

      year = `${model.year.toString()}`;
      if (model.day.toString().length === 1) {
        let jour = model.day + 1;
        day = `${jour}`;
      } else {
        let jour = model.day + 1;
        day = `${jour}`;
      }

      if (model.month.toString().length === 1) {
        month = `${model.month}`;
      } else {
        month = `${model.month}`;
      }

      let start = new Date(model.year, model.month, model.day).getTime();
      resolve(start);
      /* if (start > end) {
        this.notif.presentError(
          'Sorry, the start date must be less than the end date',
          'danger'
        );
        reject(false);
      } else {
        let d = {};
        d['startAt'] = new Date(
          this.model.year,
          this.model.month - 1,
          this.model.day
        ).toISOString();
        d['endAt'] = new Date(
          this.model2.year,
          this.model2.month - 1,
          this.model2.day
        ).toISOString();
        resolve(d);
      } */
    });
  }
}
