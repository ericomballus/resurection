import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController, AlertController } from "@ionic/angular";
import { ResourcesService } from "src/app/services/resources.service";
import { TranslateConfigService } from "../translate-config.service";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "../services/rest-api.service";

@Component({
  selector: "app-display-resource",
  templateUrl: "./display-resource.page.html",
  styleUrls: ["./display-resource.page.scss"]
})
export class DisplayResourcePage implements OnInit {
  prod: any;
  resources: any;
  quantity: any;
  unitName: any;
  name: any;
  constructor(
    navParams: NavParams,
    public modalController: ModalController,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private resourceService: ResourcesService,
    private resApi: RestApiService
  ) {
    this.prod = navParams.get("product");
    console.log(this.prod);
    this.quantity = this.prod["quantity"];
    this.name = this.prod["name"];
  }

  ngOnInit() {
    this.getResources();
  }

  getResources() {
    this.resourceService.getResources().subscribe(data => {
      console.log(data);
      this.resources = data["resources"];
    });
  }

  closeModal() {
    this.modalController.dismiss(this.prod);
  }

  addUnit(select) {
    console.log(select);
    this.unitName = select;
    /*  let oldObj = this.tabs.filter(elt => {
        return elt.resourceId == prod._id;
      })[0];

      console.log(this.tab);
      if (oldObj) {
        console.log(oldObj);
        //
      } else {
      } */
  }

  update() {
    let qty;
    if (this.quantity) {
      qty = parseInt(this.quantity);
      this.prod["quantity"] = qty;
    }
    if (this.unitName) {
      this.prod["unitName"] = this.unitName;
    }
    this.modalController.dismiss(this.prod);
    //this.resApi.u
  }
}
