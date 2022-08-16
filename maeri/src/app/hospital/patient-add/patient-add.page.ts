import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NotificationService } from '../../services/notification.service';
import { Patient } from '../../models/patient.model';
import { HospitalService } from 'src/app/services/hospital.service';
@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.page.html',
  styleUrls: ['./patient-add.page.scss'],
})
export class PatientAddPage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  sexeTab = [{ name: 'Homme' }, { name: 'Femme' }];
  patient: Patient = null;
  sexe: string;
  constructor(
    private modalController: ModalController,
    private notifi: NotificationService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit() {}
  closeModal() {
    this.modalController.dismiss();
  }

  addPatient(form) {
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }
    this.notifi.presentLoading();
    console.log(form.value);
    form.value['sexe'] = this.sexe;
    this.hospitalService.postPatient(form.value).subscribe((doc: Patient) => {
      this.formulaire.reset();
      this.notifi.dismissLoading();
      this.notifi.presentToast(`le patient ${doc.name} enregistré`, 'primary');
      this.modalController.dismiss();
    });
  }
  getSexe(ev) {
    this.sexe = ev.target['value'];
    console.log(this.sexe);
  }
}
