import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { EmployeeAddPage } from '../employee-add/employee-add.page';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EmployeesViewUpdatePage } from '../employees-view-update/employees-view-update.page';
import { Socket } from 'ngx-socket-io';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { Router } from '@angular/router';
import { EmployeeRetailerProductAddPage } from '../employee-retailer-product-add/employee-retailer-product-add.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { EmployeesRetailerSalePage } from 'src/app/pages/employees-retailer-sale/employees-retailer-sale.page';
import { NotificationService } from 'src/app/services/notification.service';
import { EmployeeRetailerInvoicesPage } from '../employee-retailer-invoices/employee-retailer-invoices.page';

@Component({
  selector: 'app-employee-retailer-list',
  templateUrl: './employee-retailer-list.page.html',
  styleUrls: ['./employee-retailer-list.page.scss'],
})
export class EmployeeRetailerListPage implements OnInit {
  ListEmploye: Array<any>;
  tabRoles = [];
  admin: boolean = false;
  adminId: any;
  multiStoreEmploye = [];
  constructor(
    private restApiService: RestApiService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public adminService: AdminService,
    public authService: AuthServiceService,
    private socket: Socket,
    public getStoreName: GetStoreNameService,
    private router: Router,
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    public actionSheet: ActionSheetController
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
    }

    this.takeEmployees();
  }

  ngOnInit() {
    this.adminId = localStorage.getItem('adminId');
    this.webServerSocket(this.adminId);
  }
  webServerSocket(id) {
    this.socket.connect();

    this.socket.fromEvent(`${id}employeAdd`).subscribe((data) => {
      this.ListEmploye.unshift(data);
      this.takeEmployees();
    });

    this.socket.fromEvent(`${id}employeDelete`).subscribe((employeId) => {
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
      let list: any[] = data['employes'];
      this.ListEmploye = list.filter((employe) => employe.isRetailer);
      let group = this.ListEmploye.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      this.multiStoreEmploye = [];
      console.log(group);

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
    this.saveRandom.setRetailer(employe);
    const modal = await this.modalController.create({
      component: EmployeesViewUpdatePage,
      componentProps: {
        employe: { flag: 'update', data: employe },
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.takeEmployees();
    });
    return await modal.present();
  }

  async saleToRetailer(employe) {
    let product = employe['productsToSale'];
    if (product && product.length) {
      this.saveRandom.confirmIfIsRetailer();
      this.saveRandom.setRetailer(employe);
      // this.router.navigateByUrl('employees-retailer-sale');

      let path = { url: 'employee-retailer-list' };
      localStorage.setItem('backTo', JSON.stringify(path));
      this.router.navigateByUrl('/shop');
    } else {
      this.notifi.presentError(
        'this employe not have products please provide some before',
        'danger'
      );
    }
  }

  async viewEmploye(employe) {
    this.saveRandom.setRetailer(employe);
    const modal = await this.modalController.create({
      component: EmployeeRetailerProductAddPage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
  addYourRetailer() {
    this.router.navigateByUrl('/add-employee-retailer');
  }

  async manageRetailer(employe) {
    const actionSheet = await this.actionSheet.create({
      header: `${employe.name}`,
      // cssClass: 'my-custom-class',
      buttons: [
        {
          text: `Sale to ${employe.name}`,
          icon: 'cart',
          handler: () => {
            this.saleToRetailer(employe);
          },
        },
        {
          text: `Display ${employe.name}`,
          icon: 'eye',
          handler: () => {
            this.updateEmploye(employe);
          },
        },
        {
          text: 'add product',
          icon: 'bag',
          handler: () => {
            this.viewEmploye(employe);
          },
        },
        {
          text: `Invoices of ${employe.name}`,
          icon: 'cash',
          handler: () => {
            this.getRetailerInvoice(employe);
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteEmploye(employe);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async getRetailerInvoice(employe) {
    this.saveRandom.setRetailer(employe);
    const modal = await this.modalController.create({
      component: EmployeeRetailerInvoicesPage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
}
