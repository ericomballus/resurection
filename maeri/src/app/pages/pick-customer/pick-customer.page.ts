import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-pick-customer',
  templateUrl: './pick-customer.page.html',
  styleUrls: ['./pick-customer.page.scss'],
})
export class PickCustomerPage implements OnInit {
  customerList = [];
  randomList = [];
  isItemAvailable = false;
  customer = { name: '', quartier: '', ville: '', phone: '' };
  addcustomer = false;
  useBonus = false;
  customerType: any = null;
  constructor(
    public modalController: ModalController,
    private adminService: AdminService,
    public notif: NotificationService,
    public random: SaverandomService
  ) {}

  ngOnInit() {
    //  this.getMyCustomer();
  }
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
    this.adminService.getUserCustumer().subscribe((res) => {
      this.notif.dismissLoading();
      this.randomList = res['custumers'];
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
    let chef;
    this.customerList = [];
    if (this.useBonus && this.customer['chefEquipe']) {
      chef = this.getChefEquipe(this.customer['chefEquipe']);
    }
    this.modalController.dismiss({
      dismissed: true,
      customer: custo,
      chefEquipe: chef,
    });
  }
  save() {
    this.modalController.dismiss({
      dismissed: true,
      customer: this.customer,
    });
  }
  getChefEquipe(chefEquipeId) {
    let chef = this.randomList.find((custo) => custo._id == chefEquipeId);
    console.log('chef equipe', chef);

    return chef;
  }
}
