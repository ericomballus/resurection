import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
@Component({
  selector: 'app-pick-date-time',
  templateUrl: './pick-date-time.page.html',
  styleUrls: ['./pick-date-time.page.scss'],
})
export class PickDateTimePage implements OnInit {
  model: NgbDateStruct;
  date: { year: number; month: number };

  constructor(
    private saveRandom: SaverandomService,
    private modal: ModalController,
    private notifi: NotificationService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.model = this.calendar.getToday();
  }
  closeModal() {
    this.modal.dismiss();
  }
  valider() {
    let date = new Date(
      this.model.year,
      this.model.month - 1,
      this.model.day
    ).toISOString();
    this.modal.dismiss(date);
  }
}
