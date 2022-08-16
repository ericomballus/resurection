import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { Router } from "@angular/router";
import { Socket } from "ngx-socket-io";
import { SelectvendorService } from "src/app/services/selectvendor.service";
@Component({
  selector: "app-vendor-retailer-list",
  templateUrl: "./vendor-retailer-list.page.html",
  styleUrls: ["./vendor-retailer-list.page.scss"],
})
export class VendorRetailerListPage implements OnInit {
  retailerList: any;
  tab = [];
  user: any;
  constructor(
    public adminService: AdminService,
    private socket: Socket,
    private router: Router,
    public vendorService: SelectvendorService
  ) {
    // this.getVenders();
    this.getRetailerList();
    this.user = JSON.parse(localStorage.getItem("user"))[0];
    this.webServerSocket(this.user["_id"]);
    console.log(this.user);
  }

  ngOnInit() {}

  confirmRetailer(retailer) {
    // console.log(vendor);
    // let data = { vendorId: vendor["_id"], adminId: this.user["_id"] };
    this.adminService.subscribeRetailer(retailer).subscribe((result) => {
      console.log(result);
      retailer.vendorConfirm = true;
    });
  }

  getRetailerList() {
    this.adminService.getRetailer().subscribe((result) => {
      console.log(result);
      this.retailerList = result;
    });
  }

  webServerSocket(id) {
    console.log("hello hello");
    this.socket.connect();

    this.socket.fromEvent(`${id}vendor`).subscribe((data) => {
      console.log("vendor", data);
      this.getRetailerList();
    });
  }

  cancelSubscriptionRetailer(retailer) {}

  displayRetailerProductItem(retailer) {
    console.log(retailer);
    this.vendorService.setData(retailer);
    this.router.navigateByUrl("vendor-retailer-products");
  }
}
