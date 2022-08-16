import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { Router } from "@angular/router";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-vendors",
  templateUrl: "./vendors.page.html",
  styleUrls: ["./vendors.page.scss"],
})
export class VendorsPage implements OnInit {
  venders = [];
  tab: any;
  user: any;
  constructor(
    public adminService: AdminService,
    private socket: Socket,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem("user"))[0];
    this.getVendor();
  }

  ngOnInit() {}
  getVenders() {
    this.adminService.getVenders().subscribe((data: Array<any>) => {
      console.log(data);
      if (this.tab.length) {
        data.forEach((elt) => {
          this.tab.forEach((vendor) => {
            if (vendor.vendorId._id != elt._id) {
              this.venders.push(elt);
            }
          });
        });
      } else {
        this.venders = data;
      }

      // this.tab = data["users"];
    });
  }

  addVendor(vendor) {
    console.log(vendor);
    let data = { vendorId: vendor["_id"], adminId: this.user["_id"] };
    this.adminService.postVendor(data).subscribe((result) => {
      console.log(result);
      this.venders = this.venders.filter((elt) => {
        return elt._id != vendor._id;
      });
    });
  }

  getVendor() {
    this.adminService.getVendors().subscribe((result) => {
      console.log(result);
      this.getVenders();
      this.tab = result;
    });
  }
}
