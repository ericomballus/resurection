import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-patient-ordonnance',
  templateUrl: './patient-ordonnance.page.html',
  styleUrls: ['./patient-ordonnance.page.scss'],
})
export class PatientOrdonnancePage implements OnInit {
  doctorList: any[] = [];
  patient: Patient = null;
  parameter: any[] = [];
  created: any;
  doctor: User = null;
  medicamentName = null;
  medicamentList: any[] = [];
  comments: string = '';
  constructor(
    private authService: AuthServiceService,
    private modalController: ModalController,
    private saveRandom: SaverandomService,
    private restApiService: RestApiService,
    private hospitalService: HospitalService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.created = Date.now();
    this.takeProductListShop();
    this.takeEmployees();
    this.patient = this.saveRandom.getPatient();
    this.parameter = this.saveRandom.getPatientParameter();
  }
  closeModal() {
    this.modalController.dismiss();
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
      console.log(this.doctorList);

      // localStorage.setItem("user", JSON.stringify(data["users"]));
    });
  }
  selectedDoctor(ev) {
    let selectedValues = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);

    let id = selectedValues[0];

    let i = this.doctorList.findIndex((elt) => elt._id == id);
    if (i >= 0) {
      this.doctor = this.doctorList[i];
      console.log(this.doctor);
    }
  }

  takeProductListShop() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getShopList().subscribe(async (data) => {
      let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));

      if (
        this.saveRandom.getSuperManager() ||
        this.saveRandom.getSetting().manage_expenses
      ) {
        // a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      } else {
        a = data['product'].filter((elt) => elt.storeId === storeId);
      }

      console.log('product list', a);
    });
  }
  addMedicament() {
    this.medicamentList.push(this.medicamentName);
  }

  removeToList(i) {
    this.medicamentList.splice(i, 1);
  }
  save() {
    this.notifi.presentLoading();
    let ordonnance = {
      patientId: this.patient._id,
      adminId: localStorage.getItem('adminId'),
      senderId: JSON.parse(localStorage.getItem('user'))['_id'],
      authorId: this.doctor._id,
      medicamentList: this.medicamentList,
      comments: this.comments,
    };
    this.hospitalService.postOrdonnance(ordonnance).subscribe((doc) => {
      console.log(doc);
      this.notifi.dismissLoading();
      this.notifi.presentToast(
        `ordonance du patient ${this.patient.name} enregistré`,
        'success'
      );
      this.closeModal();
    });
  }
}
