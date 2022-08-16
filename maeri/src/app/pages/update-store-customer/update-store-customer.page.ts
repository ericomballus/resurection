import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-update-store-customer',
  templateUrl: './update-store-customer.page.html',
  styleUrls: ['./update-store-customer.page.scss'],
})
export class UpdateStoreCustomerPage implements OnInit {
  @Input() customer: any;
  Role = 0;
  customerList = [];
  randomList = [];
  isItemAvailable = false;
  chefEquipe: any;
  useBonus = false;

  constructor(
    public modalController: ModalController,
    private adminService: AdminService,
    public notif: NotificationService,
    private storageRandom: SaverandomService
  ) {}

  ngOnInit() {
    console.log(this.customer);
    this.getMyCustomer();
    let setting = this.storageRandom.getSetting();
    // console.log(setting);
    if (setting.use_bonus) {
      this.useBonus = true;
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  save() {
    this.notif.presentLoading();
    if (this.Role) {
      this.customer['Role'] = this.Role;
    }
    if (this.chefEquipe) {
      this.customer['chefEquipe'] = this.chefEquipe['_id'];
    }
    this.adminService.updateUserCustumer(this.customer).subscribe((res) => {
      this.notif.dismissLoading();
      this.dismiss();
    });
  }
  logValue(ev) {
    if (ev.detail.value === 'C') {
      this.Role = 1;
      this.customer['Role'] = this.Role;
    } else {
      this.Role = 0;
      this.customer['Role'] = this.Role;
    }
  }

  getMyCustomer() {
    this.adminService.getUserCustumer().subscribe((res) => {
      console.log(res);
      // this.randomList = res["custumers"];
      this.customerList = res['custumers'];
      this.customerList = this.customerList.filter(
        (customer) => customer['Role'] == 1
      );
      console.log(this.customerList);
    });
  }
  addChefEquipe(ev) {
    let id = ev.target['value'];
    this.chefEquipe = this.customerList.find((customer) => customer._id == id);
    console.log(this.chefEquipe);
  }

  typeDeClient(ev) {
    console.log(ev);
    this.customer['customerType'] = ev.detail.value;
  }
}
