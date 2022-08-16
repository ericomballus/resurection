import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/translate-config.service";
import { RestApiService } from "src/app/services/rest-api.service";
import {
  ModalController,
  AlertController,
  ActionSheetController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-product-manufactured-manage",
  templateUrl: "./product-manufactured-manage.page.html",
  styleUrls: ["./product-manufactured-manage.page.scss"],
})
export class ProductManufacturedManagePage implements OnInit {
  manufacturedItem = [];
  constructor(
    private translateConfigService: TranslateConfigService,
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public translate: TranslateService
  ) {
    this.takeManufacturedItems();
    this.languageChanged();
  }

  ngOnInit() {}

  languageChanged() {
    console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  takeManufacturedItems() {
    let tab = [];
    this.restApiService.getManufacturedProductItemResto2().subscribe((data) => {
      //this.restApiService.getProductList().subscribe(data => {
      console.log(data);
      this.manufacturedItem = data;
    });
  }
  displayDetails(prod) {}
}
