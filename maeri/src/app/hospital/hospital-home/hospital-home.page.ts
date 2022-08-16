import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { PatientAddPage } from '../patient-add/patient-add.page';
import { HospitalService } from 'src/app/services/hospital.service';
import { Patient } from '../../models/patient.model';
import { UrlService } from '../../services/url.service';
import { take, takeUntil, takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import io from 'socket.io-client';
import { PatientDetailPage } from '../patient-detail/patient-detail.page';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-hospital-home',
  templateUrl: './hospital-home.page.html',
  styleUrls: ['./hospital-home.page.scss'],
})
export class HospitalHomePage implements OnInit {
  patientTab: Patient[] = [];
  customerList: Patient[] = [];
  randomList: Patient[] = [];
  isItemAvailable = false;
  public sockets;
  public url;
  destroy$ = new Subject();
  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private hospitalService: HospitalService,
    private urlService: UrlService,
    private saveRandom: SaverandomService
  ) {}

  ngOnInit() {
    this.menu.enable(true, 'first');
    this.getAllPatients();
    this.getPatients();
    this.takeUrl();
    let id = localStorage.getItem('adminId');
    this.webServerSocket(id);
  }
  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.url = data;
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

  getPatients() {
    this.hospitalService.getPatientAddToday().subscribe((docs: Patient[]) => {
      console.log(docs);
      this.patientTab = docs;
    });
  }
  getAllPatients() {
    this.hospitalService.getAllPatient().subscribe((docs: Patient[]) => {
      this.randomList = docs;
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
  }
}
