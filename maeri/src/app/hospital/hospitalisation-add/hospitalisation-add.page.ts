import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-hospitalisation-add',
  templateUrl: './hospitalisation-add.page.html',
  styleUrls: ['./hospitalisation-add.page.scss'],
})
export class HospitalisationAddPage implements OnInit {
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  doctorList: any[] = [];
  patient: Patient = null;
  doctor: User = null;
  lit: any = null;
  salle: any = null;
  constructor(
    private calendar: NgbCalendar,
    private notif: NotificationService,
    private authService: AuthServiceService,
    private modalController: ModalController,
    private saveRandom: SaverandomService,
    private hopitalService: HospitalService
  ) {}

  ngOnInit() {
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
    this.takeEmployees();
    this.patient = this.saveRandom.getPatient();
  }
  closeModal() {
    this.modalController.dismiss();
  }
  async getStartDate() {
    try {
      await this.notif.presentAlertConfirm(
        "vous confirmez l'enregistrement ?",
        'OUI',
        'NON'
      );
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
      console.log('start===>', start);
      let end = new Date(
        this.model2.year,
        this.model2.month,
        this.model2.day
      ).getTime();

      if (start < end) {
        console.log('impossible');
        this.notif.presentError(
          'Sorry, the start date must be less than the end date',
          'danger'
        );
      } else {
        let hospi = {
          patientId: this.patient._id,
          adminId: localStorage.getItem('adminId'),
          senderId: JSON.parse(localStorage.getItem('user'))['_id'],
          authorId: this.doctor._id,
          startAt: start,
        };

        this.hopitalService.postHospitalisation(hospi).subscribe((data) => {
          console.log(data);
          this.notif.presentToast(
            `hospitalisation ${this.patient.name} enregistré`,
            'primary'
          );
          this.closeModal();
        });
      }
    } catch (error) {}
  }
  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      console.log(data);
      let tab: any[] = data['employes'];
      tab.forEach((emp: User) => {
        emp.role.forEach((r) => {
          if (r.numberId == 12) {
            this.doctorList.push(emp);
          }
        });
      });

      // localStorage.setItem("user", JSON.stringify(data["users"]));
    });
  }

  selectMedecin(ev) {
    let selectedValues = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);

    console.log(selectedValues);
    let id = selectedValues[0];

    let i = this.doctorList.findIndex((elt) => elt._id == id);
    if (i >= 0) {
      console.log(this.doctorList[i]);
      this.doctor = this.doctorList[i];
    }
  }
}
