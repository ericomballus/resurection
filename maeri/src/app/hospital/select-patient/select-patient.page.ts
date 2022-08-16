import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HospitalService } from 'src/app/services/hospital.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.page.html',
  styleUrls: ['./select-patient.page.scss'],
})
export class SelectPatientPage implements OnInit {
  customerList = [];
  randomList = [];
  isItemAvailable = false;
  customer = { name: '', quartier: '', ville: '', phone: '' };
  addcustomer = false;
  useBonus = false;
  customerType: any = null;
  constructor(
    public modalController: ModalController,
    private hopitalService: HospitalService,
    public notif: NotificationService,
    public random: SaverandomService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.customerType = this.random.getClientType();
    this.getMyCustomer();
    let setting = JSON.parse(localStorage.getItem('setting'));
    // console.log(setting);
    if (setting.use_bonus) {
      this.useBonus = true;
    }
  }

  addNewCustomer() {
    this.addcustomer = true;
  }
  searchCustomer() {
    this.addcustomer = false;
  }

  getMyCustomer() {
    this.notif.presentLoading();
    this.hopitalService.getAllPatient().subscribe((res: any[]) => {
      this.notif.dismissLoading();
      this.randomList = res;
      if (this.customerType) {
        this.randomList = this.randomList.filter(
          (customer) => customer['customerType'] == this.customerType
        );
      }
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
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  pickcustomer(custo) {
    this.customer = custo;
    this.isItemAvailable = false;
    this.customerList = [];

    this.modalController.dismiss({
      dismissed: true,
      customer: custo,
    });
  }
  save() {
    this.modalController.dismiss({
      dismissed: true,
      customer: this.customer,
    });
  }
}
