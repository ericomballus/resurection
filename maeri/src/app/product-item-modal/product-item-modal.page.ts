import { Component, OnInit, Input } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { RestApiService } from "../services/rest-api.service";
@Component({
  selector: "app-product-item-modal",
  templateUrl: "./product-item-modal.page.html",
  styleUrls: ["./product-item-modal.page.scss"]
})
export class ProductItemModalPage implements OnInit {
  @Input() product: any;
  //@Input() lastName: string;
  // @Input() middleInitial: string;
  prod: any;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    public restApiService: RestApiService
  ) {
    console.log(navParams.get("product"));
    this.prod = navParams.get("product");
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss("erico");
  }

  async register(form) {
    form.value["productId"] = await this.prod._id;
    form.value["itemUrl"] = await this.prod.url;
    console.log(form.value);
    this.restApiService.productItemAdd(form.value).subscribe(data => {
      console.log(data);
      this.modalController.dismiss(data);
    });
  }
}
