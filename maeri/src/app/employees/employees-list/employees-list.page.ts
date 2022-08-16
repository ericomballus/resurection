import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ModalController, NavController } from '@ionic/angular';
import { EmployeeAddPage } from '../employee-add/employee-add.page';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EmployeesViewUpdatePage } from '../employees-view-update/employees-view-update.page';
import { Socket } from 'ngx-socket-io';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.page.html',
  styleUrls: ['./employees-list.page.scss'],
})
export class EmployeesListPage implements OnInit {
  ListEmploye: Array<any>;
  tabRoles = [];
  admin: boolean = false;
  adminId: any;
  multiStoreEmploye = [];
  storeList = [];
  constructor(
    private restApiService: RestApiService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public adminService: AdminService,
    public authService: AuthServiceService,
    private socket: Socket,
    public getStoreName: GetStoreNameService,
    private saveRandom: SaverandomService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
    }

    if (this.tabRoles.includes(1)) {
      /* this.ListEmploye = JSON.parse(localStorage.getItem("user"))[0][
        "employes"
      ]; */
      this.admin = true;
      this.takeEmployees();
    }
  }

  ngOnInit() {
    this.adminId = localStorage.getItem('adminId');
    this.webServerSocket(this.adminId);
    this.storeList = this.saveRandom.getStoreList();
  }
  webServerSocket(id) {
    this.socket.connect();

    this.socket.fromEvent(`${id}employeAdd`).subscribe((data) => {
      this.ListEmploye.unshift(data);
      this.takeEmployees();
    });

    this.socket.fromEvent(`${id}employeDelete`).subscribe((employeId) => {
      console.log('socket io action');
      console.log(employeId);
      this.ListEmploye = this.ListEmploye.filter((elt) => {
        return elt._id !== employeId;
      });
      this.takeEmployees();
    });
    this.socket.fromEvent(`${id}employeRoleAdd`).subscribe((data) => {
      this.takeEmployees();

      const tab = async () => {
        return Promise.all(
          this.ListEmploye.filter((elt) => {
            return elt._id !== data['_id'];
          })
        );
      };
      tab().then((result) => {
        console.log('hello', result);
        result.unshift(data);
        this.ListEmploye = result;
      });
    });
    this.socket.fromEvent(`${id}employeRoleDelete`).subscribe((data) => {
      this.takeEmployees();
      const tab = async () => {
        return Promise.all(
          this.ListEmploye.filter((elt) => {
            return elt._id !== data['_id'];
          })
        );
      };
      tab().then((result) => {
        console.log('hello', result);
        result.unshift(data);
        this.ListEmploye = result;
      });
    });
  }
  async employeeAdd() {
    const modal = await this.modalController.create({
      component: EmployeeAddPage,
      componentProps: {
        flag: 'employeeAddFlag',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data'] == 'add') {
        this.takeEmployees();
      } else {
      }
    });
    return await modal.present();
  }
  async employeeShow() {
    const modal = await this.modalController.create({
      component: EmployeeAddPage,
      componentProps: {
        product: 'employeeShowFlag',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  deleteEmploye(emp) {
    console.log(emp);
    //this.adminService.deleteUserEmployee(emp).subscribe(data => {
    this.authService.deleteEmploye(emp['_id']).subscribe((data) => {
      this.takeEmployees();
      // console.log(data);
      //this.takeEmployees();
    });
  }

  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      console.log(data);
      this.ListEmploye = data['employes'];
      let group = this.ListEmploye.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      this.multiStoreEmploye = [];

      for (const property in group) {
        this.multiStoreEmploye.push(group[property]);
      }
      console.log('group here', this.multiStoreEmploye);
      this.multiStoreEmploye.forEach(async (arr) => {
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });
      // localStorage.setItem("user", JSON.stringify(data["users"]));
    });
  }

  async updateEmploye(employe) {
    console.log(employe);
    this.saveRandom.setRetailer(employe);
    const modal = await this.modalController.create({
      component: EmployeesViewUpdatePage,
      componentProps: {
        employe: { flag: 'update', data: employe },
      },
    });
    modal.onDidDismiss().then((data) => {
      this.takeEmployees();
    });
    return await modal.present();
  }

  async viewEmploye(employe) {
    this.saveRandom.setRetailer(employe);
    const modal = await this.modalController.create({
      component: EmployeesViewUpdatePage,
      componentProps: {
        employe: { flag: 'display', data: employe },
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
}
