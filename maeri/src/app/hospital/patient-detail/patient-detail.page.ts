import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Patient } from 'src/app/models/patient.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { PatientOrdonnancePage } from '../patient-ordonnance/patient-ordonnance.page';
import { DetailsPage } from '../../point-of-sale/details/details.page';
import { Router } from '@angular/router';
import { HospitalisationAddPage } from '../hospitalisation-add/hospitalisation-add.page';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss'],
})
export class PatientDetailPage implements OnInit {
  patient: Patient = null;
  pet: string = 'parameter';
  parameter: any[] = [];
  ordonnanceList: any[] = [];
  hospitalisationList: any[] = [];
  invoices: any[] = [];
  constructor(
    private modalController: ModalController,
    private notifi: NotificationService,
    private hospitalService: HospitalService,
    private saveRandom: SaverandomService,
    private alertCrtl: AlertController,
    private router: Router,
    public actionSheet: ActionSheetController
  ) {}

  ngOnInit() {
    this.patient = this.saveRandom.getPatient();
    console.log(this.patient);
    this.getPatientParameter();
    this.getOrdonnanceDuPatient();
    this.getBills();
    this.getPatientHospitalisation();
  }
  closeModal() {
    this.modalController.dismiss();
  }

  getPatientParameter() {
    this.hospitalService.getParameter(this.patient).subscribe((data: any[]) => {
      console.log(data);
      this.parameter = data;
    });
  }
  getOrdonnanceDuPatient() {
    this.hospitalService
      .getPatientOrdonnance(this.patient)
      .subscribe((data: any[]) => {
        console.log('ordonance ici ===>', data);
        this.ordonnanceList = data;
      });
  }

  getPatientHospitalisation() {
    this.hospitalService
      .getHospitalisationPatient(this.patient._id)
      .subscribe((data: any[]) => {
        console.log('hospitalisation ===>', data);
        this.hospitalisationList = data;
      });
  }

  getBills() {
    this.hospitalService
      .getPatientBills(this.patient._id)
      .subscribe((data: any[]) => {
        console.log('les factures ici ===>', data);
        this.invoices = data;
      });
  }
  segmentChanged(ev) {
    console.log(ev);
  }
  async addParameter() {
    const alert = await this.alertCrtl.create({
      header: `Available ${this.patient.name}`,
      inputs: [
        {
          name: 'weight',
          type: 'number',
          placeholder: 'poids',
        },
        {
          name: 'temperature',
          type: 'number',
          placeholder: 'temperature',
        },
        {
          name: 'tension',
          type: 'number',
          placeholder: 'tension',
        },
      ],
      buttons: [
        {
          text: 'annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'save',
          handler: (data) => {
            console.log(data);
            this.notifi
              .presentAlertConfirm(
                'enregistrer les nouveaux parametres ?',
                'oui',
                'Non'
              )
              .then(() => {
                for (const key in data) {
                  data[key] = parseInt(data[key]);
                }
                console.log(data);
                data['patientId'] = this.patient._id;
                this.notifi.presentLoading();
                this.hospitalService.postParameters(data).subscribe((data) => {
                  this.notifi.dismissLoading();
                  this.parameter.push(data);
                });
              })
              .catch((err) => console.log(err));
          },
        },
      ],
    });

    await alert.present();
  }

  async addOrdonnance() {
    this.saveRandom.setPatientParameter(this.parameter);
    const modal = await this.modalController.create({
      component: PatientOrdonnancePage,
      componentProps: {},
      backdropDismiss: false,
      cssClass: 'modal-size',
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
  displayMore(p) {
    p.open = !p.open;
  }
  async displayDetails(order, index) {
    console.log(order);
    this.closeModal();
    this.saveRandom.setData(order);
    localStorage.setItem('voucherBill', JSON.stringify(order));
    this.router.navigateByUrl('bill-details');

    /* const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        order2: order,
        // Pos: true,
        Bill: true,
      },
      cssClass: 'custom-modal',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data && res.data['cancel']) {
        let doc = res.data['result'];
        this.invoices.splice(index, 1, doc);
      }
    });
    return await modal.present();*/
  }
  updatePatient() {
    this.notifi.presentLoading();
    this.hospitalService
      .updatePatient(this.patient)
      .subscribe((res: Patient) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('mise a jour reussi!!', 'success');
        this.patient = res;
      });
  }
  async addHosPitalisation() {
    let found = this.hospitalisationList.filter((hospi) => hospi.actif == true);
    if (found && found.length) {
      this.notifi.presentToast(
        'action impossible car le patient est déja hospitalisé!',
        'danger'
      );
      return;
    }
    this.saveRandom.setPatientParameter(this.parameter);
    const modal = await this.modalController.create({
      component: HospitalisationAddPage,
      componentProps: {},
      backdropDismiss: false,
      cssClass: 'modal-size',
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.getPatientHospitalisation();
    });
    return await modal.present();
  }

  async stopHosP(data, index) {
    try {
      await this.notifi.presentAlertConfirm(
        `vous confirmez la fin de l'hospitalisation du patient ${this.patient.name} ?`,
        'OUI',
        'NON'
      );
      this.notifi.presentLoading();
      this.hospitalService
        .endHospitalisationPatient(data)
        .subscribe((hospi) => {
          this.notifi.dismissLoading();
          this.notifi.presentToast('fin hospitalisation enregistré', 'primary');
          // data= hospi
          console.log(hospi);
          this.hospitalisationList.splice(index, 1, hospi);
        });
    } catch (error) {}
  }
}
