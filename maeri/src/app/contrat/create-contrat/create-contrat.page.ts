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
@Component({
  selector: 'app-create-contrat',
  templateUrl: './create-contrat.page.html',
  styleUrls: ['./create-contrat.page.scss'],
})
export class CreateContratPage implements OnInit {
  admin: Admin;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  constructor(
    private randomStorage: SaverandomService,
    private modal: ModalController,
    private calendar: NgbCalendar,
    public notif: NotificationService,
    public contratService: ContratService
  ) {}

  ngOnInit() {
    this.admin = this.randomStorage.getUserAdmin();
    console.log(this.admin);
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
  }

  closeModal() {
    this.modal.dismiss();
  }
  async postContrat(form) {
    console.log(form);
    let contrat = form.value;
    contrat['status'] = true;
    try {
      let info = await this.getDate();
      console.log(info);
      contrat['startAt'] = info.startAt;
      contrat['endAt'] = info.endAt;
      contrat['adminId'] = this.admin._id;
      this.contratService.postContrat(contrat).subscribe((res) => {
        this.notif.presentToast(
          `contrat du client ${this.admin.firstName} enregistré!`,
          'success'
        );
        this.modal.dismiss();
      });
    } catch (error) {
      this.notif.presentToast(
        `impossible de faire cette opération verfier les dates`,
        'danger'
      );
    }
  }

  getDate(): Promise<any> {
    return new Promise((resolve, reject) => {
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
      }
    });
  }
}
