import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-employee-retailer',
  templateUrl: './add-employee-retailer.page.html',
  styleUrls: ['./add-employee-retailer.page.scss'],
})
export class AddEmployeeRetailerPage implements OnInit {
  storeList = [];
  storeId: any;
  role = [];
  roles: Array<any>;

  constructor(
    public authService: AuthServiceService,
    public adminService: AdminService,
    public toastController: ToastController,
    public getstoreList: GetStoreNameService,
    public notif: NotificationService
  ) {
    this.getUserStore();
    this.takeUserRoles();
  }

  ngOnInit() {}

  register(form) {
    console.log(form.value);
    this.notif.presentLoading();

    if (localStorage.getItem('adminemail')) {
      form.value['adminEmail'] = localStorage.getItem('adminemail');
      if (this.storeList.length == 1) {
        this.storeId = this.storeList[0]['id'];
      }
      if (this.storeId) {
        form.value['storeId'] = this.storeId;
      }
      form.value['isRetailer'] = true;
      form.value['role'] = this.role;
      form.value['phone'] = form.value['telephone'];
      this.authService.addEmployee(form.value).subscribe(
        (data) => {
          console.log('retour ici', data);
          this.notif.dismissLoading();
          this.notif.presentToast('add ok', 'success');
        },
        (err) => {
          this.notif.dismissLoading();
          this.notif.presentError(
            'remote error please check if remain field',
            'danger'
          );
        }
      );
    } else {
      this.notif.dismissLoading();
      this.notif.presentError('please provide admin email', 'danger');
    }
  }
  async getUserStore() {
    if (
      JSON.parse(localStorage.getItem('credentialAccount'))['users'][0][
        'storeId'
      ]
    ) {
      this.storeList = JSON.parse(localStorage.getItem('credentialAccount'))[
        'users'
      ][0]['storeId'];
    }
  }

  async assignSore(ev: Event) {
    let id = ev.target['value'];
    this.storeId = id;
  }

  takeUserRoles() {
    this.adminService.getUserRole().subscribe((data) => {
      this.roles = data['roles'];
      this.roles.forEach((rol) => {
        if (rol.numberId == 6) {
          this.role.push(rol);
        }
      });
    });
  }
}
