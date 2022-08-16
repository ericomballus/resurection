import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-add-store-customer',
  templateUrl: './add-store-customer.page.html',
  styleUrls: ['./add-store-customer.page.scss'],
})
export class AddStoreCustomerPage implements OnInit {
  ionicForm: FormGroup;
  useBonus = false;
  Role = 0;
  customerList = [];
  randomList = [];
  isItemAvailable = false;
  chefEquipe: any;
  customerType: any = null;
  constructor(
    public formBuilder: FormBuilder,
    public modalController: ModalController,
    private adminService: AdminService,
    private notification: NotificationService,
    private randomStorage: SaverandomService
  ) {}

  ngOnInit() {
    this.ionicForm = new FormGroup({
      name: new FormControl(),
      phone: new FormControl(),
      ville: new FormControl(),
      quartier: new FormControl(),
      codeClient: new FormControl(),
      reduction: new FormControl(),
    });
    let setting = this.randomStorage.getSetting();
    if (setting.use_bonus) {
      this.useBonus = true;
    }
    this.getMyCustomer();
  }
  validation() {
    console.log(this.ionicForm.value);
    let customer = this.ionicForm.value;
    if (customer['reduction'] > 100) {
      this.notification.presentAlert(
        'le pourcentage de reduction doit etre inférieur a 100'
      );

      return;
    }
    if (this.Role) {
      customer['Role'] = this.Role;
    }
    if (this.chefEquipe) {
      customer['chefEquipe'] = this.chefEquipe['_id'];
    }
    if (this.customerType) {
      customer['customerType'] = this.customerType;
    }
    this.notification.presentLoading();
    this.adminService.createdCustumer(customer).subscribe((data) => {
      this.ionicForm.reset();
      this.notification.dismissLoading();
      this.notification.presentToast(
        `customer ${customer['name']} created!!`,
        'primary'
      );
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
  logValue(ev) {
    if (ev.detail.value === 'C') {
      this.Role = 1;
    } else {
      this.Role = 0;
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
    this.customerType = ev.detail.value;
  }
}
