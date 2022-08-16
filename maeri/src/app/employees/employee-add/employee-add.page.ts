import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
//import { RestApiService } from '../service/rest-api.service';
import { AdminService } from '../../services/admin.service';
import { GetStoreNameService } from '../../services/get-store-name.service';
import { AjouteemployePage } from 'src/app/ajouteemploye/ajouteemploye.page';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { Setting } from 'src/app/models/setting.models';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.page.html',
  styleUrls: ['./employee-add.page.scss'],
})
export class EmployeeAddPage implements OnInit {
  @ViewChild('selectRole', { static: false }) selectRole: any;
  @Input() product: any;
  //@Input() lastName: string;
  // @Input() middleInitial: string;
  addemplpoye: any;
  user: any;
  ListEmploye: any;
  userEmail: any;
  role = [];
  roles: Array<any>;
  check: any; //utilisé pour afficher les employés
  manage_employee: any; //utilisé pour afficher les employés
  Changes: any; //utilié pour update un employé
  employe: any; //utilisé pour update un employé
  OneUser = { name: '', poste: '', telephone: '', password: '', confirm: '' };
  onerole: any;
  adminEmail: any;
  RoleToRemove: string; //le role a supprimé il est affiché apres selection
  userselectRole: any;
  storeList: any;
  storeId: any;
  setting: Setting;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    public authService: AuthServiceService,
    public adminService: AdminService,
    public toastController: ToastController,
    public getstoreList: GetStoreNameService,
    public notif: NotificationService,
    private translateConfigService: TranslateConfigService,
    private saveRandom: SaverandomService
  ) {
    console.log(localStorage.getItem('email'));
    let flag = navParams.get('flag');
    this.adminEmail = localStorage.getItem('adminemail');
    if (flag === 'employeeAddFlag') {
      this.addemplpoye = true;
      // return;
    } else {
      this.addemplpoye = false;
      this.manage_employee = true;
    }
    //this.configEmploye();
    this.takeUserRoles();
    this.getUserStore();
    // this.Takeemployees();
    //;
    // this.Takeemployees();
  }

  ngOnInit() {
    this.languageChanged();
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  register(form) {
    console.log(form.value);
    form.value['role'] = this.role;
    form.value['adminEmail'] = this.adminEmail;
    let obj = {};
    /* obj["name"] = form.value.name;
    obj["telephone"] = form.value.telephone;
    obj["poste"] = form.value.poste;
    obj["password"] = form.value.password;
    obj["role"] = form.value.role;
    obj["adminEmail"] = form.value.adminEmail; */
    if (this.storeList.length == 1) {
      this.storeId = this.storeList[0]['id'];
    }
    if (this.storeId) {
      form.value['storeId'] = this.storeId;
    }
    console.log();

    console.log(this.storeId);
    console.log(form.value);

    this.authService.addEmployee(form.value).subscribe(
      (data) => {
        console.log('retour ici', data);

        this.presentToast(form.value.name);
        this.OneUser = {
          name: '',
          poste: '',
          telephone: '',
          password: '',
          confirm: '',
        };
        this.modalController.dismiss('add');
        this.onerole = null;
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

  async presentToast3() {
    //fire when role remove
    const toast = await this.toastController.create({
      message: `role remove.`,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  closeModal() {
    this.modalController.dismiss('erico');
  }

  takeUserRoles() {
    this.adminService.getUserRole().subscribe((data) => {
      //  console.log(data);
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
          // console.log(r.numberId);

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
    });
  }
  async test() {
    const modal = await this.modalController.create({
      component: AjouteemployePage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data']) {
        let role = data['data'];
        this.userselectRole = role.name;
        this.role.push(role);
      }
    });
    return await modal.present();
  }

  updateCancel() {
    // console.log(emp);
    this.manage_employee = true;
    this.Changes = false;
    // this.employe = emp;
  }
  updateEmploye(emp) {
    console.log(emp);
    this.manage_employee = false;
    this.Changes = true;
    this.employe = emp;
  }

  changesUpdate(emp) {}

  configEmploye() {
    this.takeUserRoles();
    this.ListEmploye = JSON.parse(localStorage.getItem('user'));

    this.user = this.ListEmploye[0]['employes']; //this.user[0]._id
    let email = localStorage.getItem('email');

    if (email) {
      this.userEmail = email;
    }
  }
  async getUserStore() {
    try {
      let store: any = await this.getstoreList.getLocalStoreList();
      if (store.length) {
        this.storeList = store;
      }
    } catch (e) {
      this.notif.presentError(e, 'red');
    }
  }

  async assignSore(ev: Event) {
    let id = ev.target['value'];
    this.storeId = id;
  }
}
