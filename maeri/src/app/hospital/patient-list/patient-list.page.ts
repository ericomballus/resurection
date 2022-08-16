import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { NotificationService } from 'src/app/services/notification.service';
import io from 'socket.io-client';
import { PatientAddPage } from '../patient-add/patient-add.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { PatientDetailPage } from '../patient-detail/patient-detail.page';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {
  patientTab: Patient[] = [];
  customerList: Patient[] = [];
  randomList: Patient[] = [];
  isItemAvailable = false;
  public sockets;
  public url;
  destroy$ = new Subject();
  constructor(
    private hopitalService: HospitalService,
    private notif: NotificationService,
    private menu: MenuController,
    private modalController: ModalController,
    private saveRandom: SaverandomService
  ) {}

  ngOnInit() {
    this.menu.enable(true, 'first');
    this.getMyCustomer();
  }
  getMyCustomer() {
    this.notif.presentLoading();
    this.hopitalService.getAllPatient().subscribe((res: any[]) => {
      this.notif.dismissLoading();
      this.randomList = res;
      this.patientTab = res;
    });
  }
  initializeItems() {
    this.customerList = this.randomList;
  }

  getCustomerList(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.customerList = this.customerList.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.isItemAvailable = false;
      this.customerList = [];
    }
  }

  webServerSocket(id) {
    this.sockets = io(this.url);
    this.sockets.on(`${id}patient`, (data: Patient) => {
      this.patientTab.unshift(data);
      this.randomList.push(data);
    });

    this.sockets.on(`${id}patientUpdate`, (data: Patient) => {
      let index = this.patientTab.findIndex(
        (patient) => patient._id == data._id
      );
      if (index >= 0) {
        this.patientTab.splice(index, 1, data);
        this.randomList.splice(index, 1, data);
      }
    });
  }

  async addPatient() {
    const modal = await this.modalController.create({
      component: PatientAddPage,
      componentProps: {},
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
  async pickcustomer(custo) {
    console.log(custo);
    this.customerList = [];
    this.saveRandom.setPatient(custo);
    const modal = await this.modalController.create({
      component: PatientDetailPage,
      componentProps: {},
      backdropDismiss: false,
      cssClass: 'modal-size',
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
}
