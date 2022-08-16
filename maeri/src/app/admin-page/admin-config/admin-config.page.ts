import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../services/admin.service";
//import { Router } from "@angular/router";
import { NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-admin-config",
  templateUrl: "./admin-config.page.html",
  styleUrls: ["./admin-config.page.scss"]
})
export class AdminConfigPage implements OnInit {
  userRole: any;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    private adminserv: AdminService
  ) {
    this.getRole();
  }

  ngOnInit() {}

  update(form) {
    /*  this.adminserv.Updatecustumer(this.custumer).subscribe(data => {
      console.log(data);
      //this.user = data["users"][0];
      this.modalController.dismiss("erico");
      // this.router.navigate(["admin-page"]);
    }); */
  }

  closeModal() {
    this.modalController.dismiss("erico");
  }
  getRole() {
    this.adminserv.getUserRole().subscribe(data => {
      console.log(data);
      this.userRole = data["roles"];
    });
  }
  addUserRole(form) {
    this.adminserv.postUserRole(form.value).subscribe(data => {
      console.log(data);
      this.getRole();
    });
  }
  deleteRole(role) {
    console.log(role);
    this.adminserv.deleteUserRole(role).subscribe(data => {
      console.log(data);
      this.getRole();
    });
  }
}
