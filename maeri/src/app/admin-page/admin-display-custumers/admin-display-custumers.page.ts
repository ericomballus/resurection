import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import {
  ModalController,
  AlertController,
  ActionSheetController,
} from '@ionic/angular';
import { CustomerModalPage } from '../../customer-modal/customer-modal.page';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { MonitoringPage } from 'src/app/monitoring/monitoring.page';
import { DatabasePage } from 'src/app/database/database.page';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-admin-display-custumers',
  templateUrl: './admin-display-custumers.page.html',
  styleUrls: ['./admin-display-custumers.page.scss'],
})
export class AdminDisplayCustumersPage implements OnInit {
  custumers = [];
  custumersConnect = [];
  tab = [];
  adminId: any;
  admin_action = false;
  public sockets;
  constructor(
    public adminService: AdminService,
    public modalController: ModalController,
    private socket: Socket,
    public router: Router,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public randomStorage: SaverandomService
  ) {
    this.getCustomers();
    this.adminId = localStorage.getItem('adminId');
    this.webServerSocket(this.adminId);
  }

  async ngOnInit() {}

  ionViewWillEnter() {
    this.getCustomers();
  }

  getCustomers() {
    this.adminService.getUser().subscribe((data) => {
      console.log(data);
      this.custumers = [];
      /* data["users"].forEach((user) => {
        if (!user["delete"]) {
          this.custumers.push(user);
        }
        if (user["userConnection"]) {
          let conn = user["userConnection"]["lastConnection"];

          let last = new Date(conn).getTime();
          console.log(last);
          let time = new Date().getTime();
          let res = time - last;
          console.log(time - last);
          if (res < 500000) {
            this.custumersConnect.push(user);
          }
        }
      });*/
      this.custumers = data['users'];
      this.custumersConnect = data['users'];
      // this.tab = data["users"];
    });
  }

  async updateCustomer(user) {
    this.admin_action = true;
    const modal = await this.modalController.create({
      component: CustomerModalPage,
      componentProps: {
        custumer: user,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  async monitoringCustomer(user) {
    const modal = await this.modalController.create({
      component: MonitoringPage,
      componentProps: {
        custumer: user,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  webServerSocket(id) {
    console.log('hello hello');
    this.socket.connect();

    this.socket.emit('set-name', name);

    this.socket.fromEvent('custumerupdate').subscribe((data) => {
      //console.log(data);
      let index = this.custumers.findIndex((elt) => {
        return elt._id === data['_id'];
      });
      console.log(index);
      if (index >= 0) {
        this.custumers.splice(index, 1, data);
      }
    });

    this.socket.fromEvent('newUser').subscribe((data) => {
      console.log(data);
      this.custumers.push(data);
    });

    this.socket.fromEvent('incomingRequest').subscribe((data) => {
      let index = this.custumersConnect.findIndex((user) => {
        return user._id === data['_id'];
      });
      console.log(index);
      if (index >= 0) {
        this.custumersConnect.splice(index, 1, data);
      } else {
        this.custumersConnect.push(data);
      }

      let index2 = this.custumers.findIndex((user) => {
        return user._id === data['_id'];
      });

      if (index2 >= 0) {
        this.custumers.splice(index2, 1, data);
      }
    });
  }

  addCustomer() {
    this.router.navigateByUrl('register');
  }

  displayDatabase() {
    this.adminService.customersDB(this.adminId).subscribe((data) => {
      console.log(data);
      // this.Godatabase(data);
    });
  }

  async goDatabase(db) {
    const modal = await this.modalController.create({
      component: DatabasePage,
      componentProps: {
        db: db,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  goToProducts() {
    this.router.navigateByUrl('admin-products');
  }

  async presentActionSheet(user) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [
        {
          text: 'Update',
          role: 'destructive',
          icon: 'contact',
          handler: () => {
            this.updateCustomer(user);
          },
        },
        {
          text: 'Monitoring',
          icon: 'share',
          handler: () => {
            this.monitoringCustomer(user);
          },
        },
        {
          text: 'Contrat',
          icon: 'arrow-dropright-circle',
          handler: () => {
            this.randomStorage.setUserAdmin(user);
            this.router.navigateByUrl('user-contrat');
          },
        },
        {
          text: 'Delete',
          icon: 'trash-outline',
          handler: () => {
            this.presentAlertConfirm(user);
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
  }

  async presentAlertConfirm(user) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Delete user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Ok',
          handler: () => {
            user.delete = true;
            this.removeUser(user);
          },
        },
      ],
    });

    await alert.present();
  }
  removeUser(user) {
    this.adminService.deleteCustomer(user).subscribe((data) => {
      console.log(data);
      this.getCustomers();
    });
  }
}
