import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { Router } from "@angular/router";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-add-vendor",
  templateUrl: "./add-vendor.page.html",
  styleUrls: ["./add-vendor.page.scss"],
})
export class AddVendorPage implements OnInit {
  venders: any;
  tab = [];
  user: any;
  constructor(
    public adminService: AdminService,
    private socket: Socket,
    private router: Router
  ) {
    // this.getVenders();
    this.getVendor();
    this.user = JSON.parse(localStorage.getItem("user"))[0];
    this.webServerSocket(this.user["_id"]);
    console.log(this.user);
  }

  ngOnInit() {}

  getVenders() {
    this.adminService.getVenders().subscribe((data) => {
      console.log(data);
      this.venders = data;
      // this.tab = data["users"];
    });
  }

  cancelVendor(vendor) {
    console.log(vendor);
    // let data = { vendorId: vendor["_id"], adminId: this.user["_id"] };
    this.adminService.unsubscribedVendor(vendor).subscribe((result) => {
      console.log(result);
      this.venders = this.venders.filter((elt) => {
        return elt._id !== vendor._id;
      });
    });
  }

  getVendor() {
    this.adminService.getVendors().subscribe((result) => {
      console.log(result);
      this.venders = result;
    });
  }

  update(user) {
    this.adminService.updateCustomer(user).subscribe((data) => {
      console.log(data);
    });
  }

  selectVendor() {
    this.router.navigateByUrl("vendors");
  }

  webServerSocket(id) {
    console.log("hello hello");
    this.socket.connect();

    this.socket.fromEvent(`${id}vendor`).subscribe((data) => {
      console.log("vendor", data);
      this.getVendor();
    });
  }
}
