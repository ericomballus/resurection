import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NavParams, ToastController, ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Setting } from 'src/app/models/setting.models';
@Component({
  selector: 'app-employees-view-update',
  templateUrl: './employees-view-update.page.html',
  styleUrls: ['./employees-view-update.page.scss'],
})
export class EmployeesViewUpdatePage implements OnInit {
  Changes: any; //utilié pour update un employé
  employee: any; //utilisé pour update un employé
  disiplay_details: any;
  role = [];
  roles: Array<any>;
  employeId: any;
  userStore = [];
  userRole = [];
  employeStore: any;
  isRetailer = false;
  setting: Setting;
  constructor(
    public authService: AuthServiceService,
    navParams: NavParams,
    public toastController: ToastController,
    public modalController: ModalController,
    public adminService: AdminService,
    private saveRandom: SaverandomService,
    private notifi: NotificationService
  ) {
    let data = navParams.get('employe');
    this.employee = data['data'];
    this.userRole = data['data']['role'];
    console.log('result employee ==>', this.employee);
    this.employeId = this.employee['_id'];
    if (this.employee['isRetailer']) {
      this.isRetailer = true;
    }
    if (data['flag'] === 'update') {
      this.Changes = true;
    }
    if (data['flag'] === 'display') {
      this.disiplay_details = true;
    }
    this.takeUserRoles();
    this.getUserAdmin();
  }

  ngOnInit() {
    this.setting = this.saveRandom.getSetting();
  }

  register(form) {
    // console.log(form.value['newpassword'].length);
    console.log(form.value);
    if (form.value['newpassword'] && form.value['newpassword'].length) {
      this.notifi
        .presentAlertConfirm(
          "voulez vous changer le mot de passe de l'empoyé ?",
          'oui',
          'non'
        )
        .then(() => {
          form.value['changepassword'] = form.value['newpassword'];
        })
        .catch(() => {});
    }
    form.value['role'] = this.role;
    form.value['_id'] = this.employeId;
    if (this.employeStore) {
      form.value['storeId'] = this.employeStore;
    }
    let tables = [];

    this.roles.forEach((elt) => {
      if (elt.isChecked) {
        tables.push(elt);
      }
    });
    this.employee['roles'] = tables;

    this.authService.updateEmployee(form.value).subscribe(
      (data) => {
        this.authService.addEmployeeRole(this.employee).subscribe((res) => {
          console.log(res);
          this.presentToast(form.value.name);
          this.modalController.dismiss('data');
        });

        // console.log("le storage", JSON.parse(localStorage.getItem("user")));
      },
      (err) => {
        console.log(err);
        this.presentToast2();
      }
    );
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: `${msg} have been saved.`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-class',
    });
    toast.present();
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: `error.`,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  closeModal() {
    this.modalController.dismiss('erico');
  }

  takeUserRoles() {
    this.adminService.getUserRole().subscribe((data) => {
      let tabRoles = [];
      this.setting = this.saveRandom.getSetting();
      // this.roles = data['roles'];
      data['roles'].forEach((r) => {
        if (
          (r.numberId == 6 ||
            r.numberId == 7 ||
            r.numberId == 8 ||
            r.numberId == 9 ||
            r.numberId == 10) &&
          this.setting.refueling_from_warehouse_production
        ) {
          console.log(r.numberId);

          tabRoles.push(r);
        } else if (
          r.numberId == 2 ||
          r.numberId == 3 ||
          r.numberId == 4 ||
          r.numberId == 5
        ) {
          tabRoles.push(r);
        }
      });
      this.roles = tabRoles;
      this.userRole.forEach((role) => {
        this.roles.forEach((elt) => {
          if (elt._id == role._id) {
            elt['isChecked'] = true;
          }
        });
      });
      console.log(this.roles);
    });
  }

  getUserAdmin() {
    this.adminService
      .getUserById(this.employee['adminId'])
      .subscribe((data) => {
        console.log(data);
        if (data['users'][0]['storeId']) {
          this.userStore = data['users'][0]['storeId'];
        }
      });
  }

  updateRoles(ev: Event) {
    let newRole = [];

    let tab = ev.target['value'];
    // this.check = true;

    let role = this.roles.filter((item) => item['_id'] == tab)[0];
    newRole.push(role);
    console.log(newRole);

    /* if (this.employee["role"] && this.employee["role"].length) {
      this.employee["roles"] = [...this.employee["role"], ...newRole];
    } else {
      this.employee["roles"] = newRole;
    } */

    console.log(this.employee['roles']);
    return;
    // this.employee["role"] = newRole;
    this.employee['employeId'] = this.employee['_id'];
    // this.authService.addEmployeeRole(this.employee).subscribe(
    this.authService.updateEmployee(this.employee).subscribe(
      (data) => {
        console.log('retour ici', data);
        // this.presentToast(this.employee.name);
      },
      (err) => {
        console.log(err);
        this.presentToast2();
      }
    );
  }

  async removeRole(ev: Event) {
    let removeRole = [];
    let id = ev.target['value'];
    let tab = await this.employee.role.filter((item) => item['_id'] === id);
    removeRole = await this.employee.role.filter((item) => item['_id'] === id);

    console.log(this.employee.role);
    let obj = {
      employeId: this.employee['_id'],
      roleToRemoveId: removeRole[0]['_id'],
    };

    this.authService.deleteEmployeeRole(obj).subscribe(
      (data) => {
        // console.log("retour ici", data);
        this.presentToast(this.employee.name);
      },
      (err) => {
        console.log(err);
        this.presentToast2();
      }
    );
  }

  async assignSore(ev: Event) {
    let id = ev.target['value'];
    this.employeStore = id;
  }

  changePrice(event, prod) {
    // console.log(event);

    let value = parseInt(event.detail.value);
    if (Number.isNaN(value)) {
    } else {
      let retailer = this.saveRandom.getRetailer();
      let productsToSale: any[] = retailer['productsToSale'];
      let products = productsToSale.filter((p) => {
        return prod._id == p['_id'];
      })[0];
      if (products) {
        products['retailerPrice'] = value;
      }
      let index = productsToSale.findIndex((elt) => {
        return elt._id == prod._id;
      });
      if (index >= 0) {
        productsToSale.splice(index, 1, products);
      } else {
        productsToSale.push(products);
      }
      retailer['productsToSale'] = productsToSale;
      this.saveRandom.setRetailer(retailer);
    }
  }

  save() {
    this.authService.updateEmployee(this.saveRandom.getRetailer()).subscribe(
      (data) => {
        this.presentToast(this.employee.name);
        this.modalController.dismiss('data');
      },
      (err) => {
        console.log(err);
        this.presentToast2();
      }
    );
  }
}
