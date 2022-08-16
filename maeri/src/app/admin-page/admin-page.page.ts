import { Component, OnInit } from "@angular/core";
import { AdminService } from "../services/admin.service";
import {
  ModalController,
  AlertController,
  ActionSheetController,
} from "@ionic/angular";
import { CustomerModalPage } from "../customer-modal/customer-modal.page";
import { Socket } from "ngx-socket-io";
import { Router } from "@angular/router";
import { DatabasePage } from "../database/database.page";
import { AdminConfigPage } from "./admin-config/admin-config.page";
import { MonitoringPage } from "../monitoring/monitoring.page";
import io from "socket.io-client";
@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.page.html",
  styleUrls: ["./admin-page.page.scss"],
})
export class AdminPagePage implements OnInit {
  custumers = [];
  tab = [];
  adminId: any;
  public sockets;

  constructor(
    public adminService: AdminService,
    public modalController: ModalController,
    private socket: Socket,
    public router: Router,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) {
    //  this.getCustomers();
    // this.Displaydatabase();
    this.adminId = localStorage.getItem("adminId");
    this.webServerSocket(this.adminId);
  }

  async ngOnInit() {
    /*   this.socket.connect();
    this.socket.fromEvent("custumerupdate").subscribe(message => {
      console.log("depuis le socket");
      console.log(message);
      let users = this.custumers.filter(user => {
        return user["_id"] === message["_id"];
      });
    });*/
  }

  getCustomers() {
    this.adminService.getUser().subscribe((data) => {
      console.log(data);
      this.custumers = [];
      /* data["users"].forEach((user) => {
        if (!user["delete"]) {
          this.custumers.push(user);
        }
      }); */
      this.custumers = data["users"];
      // this.tab = data["users"];
    });
  }

  async updateCustomer(user) {
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
    console.log("hello hello");
    this.socket.connect();

    this.socket.emit("set-name", name);

    this.socket.fromEvent("custumerupdate").subscribe((data) => {
      console.log("user change ", data);

      let index = this.custumers.findIndex((elt) => {
        return elt._id === data["_id"];
      });
      console.log(index);
      this.custumers.splice(index, 1, data);

      //this.tab.push(data);
      // this.custumers = this.tab;

      // this.custumers.push(data);
    });

    this.socket.fromEvent(id).subscribe((data) => {
      console.log("database", data);
      // this.goDatabase(data);
      //this.takeBusItem();
    });
    this.socket.fromEvent("newUser").subscribe((data) => {
      console.log("new user", data);
    });

    this.socket.fromEvent("requestIn").subscribe((data) => {
      console.log("Incomming", data);
    });
  }

  addCustomer() {
    this.router.navigateByUrl("register");
  }

  displayDatabase() {
    this.router.navigateByUrl("database");
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
  async goToAdminConfig() {
    const modal = await this.modalController.create({
      component: AdminConfigPage,
      componentProps: {
        // db: db
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  goToProducts() {
    this.router.navigateByUrl("admin-products");
  }

  async presentActionSheet(user) {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Update",
          role: "destructive",
          icon: "contact",
          handler: () => {
            this.updateCustomer(user);
          },
        },
        {
          text: "Monitoring",
          icon: "share",
          handler: () => {
            this.monitoringCustomer(user);
          },
        },
        {
          text: "Play (open modal)",
          icon: "arrow-dropright-circle",
          handler: () => {
            console.log("Play clicked");
          },
        },
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {
            this.presentAlertConfirm(user);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentAlertConfirm(user) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      message: "Delete user?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Ok",
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
