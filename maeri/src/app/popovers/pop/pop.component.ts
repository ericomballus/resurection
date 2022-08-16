import { Component, OnInit } from "@angular/core";
import { PopoverController, NavParams } from "@ionic/angular";
import { Router } from "@angular/router";
import { SelectvendorService } from "src/app/services/selectvendor.service";
@Component({
  selector: "app-pop",
  templateUrl: "./pop.component.html",
  styleUrls: ["./pop.component.scss"],
})
export class PopComponent implements OnInit {
  venders = [];
  constructor(
    private popover: PopoverController,
    private router: Router,
    private selectVendor: SelectvendorService,
    navParams: NavParams
  ) {
    console.log(navParams.get("vendors"));
    this.venders = navParams.get("vendors");
  }

  ngOnInit() {}
  ClosePopover(vendor) {
    // [routerLink]="['/product-buy']"
    this.selectVendor.setData(vendor);
    this.popover.dismiss();
    this.router.navigateByUrl("/vendor-shop");
  }
  NoPopover() {
    // [routerLink]="['/product-buy']"
    // this.selectVendor.setData(vendor);
    this.popover.dismiss();
    this.router.navigateByUrl("/product-buy");
  }
}
