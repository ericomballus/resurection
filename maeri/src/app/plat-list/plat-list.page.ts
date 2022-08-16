import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-plat-list",
  templateUrl: "./plat-list.page.html",
  styleUrls: ["./plat-list.page.scss"],
})
export class PlatListPage implements OnInit {
  plats: any;
  constructor(navParams: NavParams) {
    this.plats = navParams.get("plats");
    console.log(this.plats);
  }

  ngOnInit() {}
}
