import { Component, OnInit, Input } from "@angular/core";
import { RestApiService } from "../services/rest-api.service";
import { ModalController, NavParams } from "@ionic/angular";
@Component({
  selector: "app-product-pack-item-modal",
  templateUrl: "./product-pack-item-modal.page.html",
  styleUrls: ["./product-pack-item-modal.page.scss"]
})
export class ProductPackItemModalPage implements OnInit {
  prod: any;
  @Input() product: any;
  // unitNamePack: any;
  //sizePack: any;
  productData: any;
  unitNamePack: any;
  sizeUnitProduct: any;
  //unitNameProduct: any;
  //productItemId: any;
  sizePack;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    public restApiService: RestApiService
  ) {
    console.log(navParams.get("product"));
    this.prod = navParams.get("product");
    this.sizePack = this.prod["sizePack"];
    //this.restApiService
    // .getOneProduct(this.prod["productId"])
    // .subscribe(data => {
    //  console.log(data);

    // this.productData = data["product"][0];
    // console.log(this.productData);
    // this.unitNamePack = this.productData["unitName"];
    // this.unitNameProduct = this.productData["unitName"];
    //this.sizeUnitProduct = this.productData["sizeUnit"];
    //this.getProductItem(data["product"][0]["_id"]);
    // });
    // this.getProductItem();
  }

  ngOnInit() {}
  closeModal() {
    this.modalController.dismiss("erico");
  }
  register(form) {
    //this.prod.newquantity = form.value["quantity"];
    // this.prod.unitNameProduct = this.unitNameProduct;
    // this.prod.sizeUnitProduct = this.sizeUnitProduct;
    // this.prod.unitNamePack = this.unitNamePack;
    // this.prod.sizePack = form.value["sizePack"];
    //this.prod.productItemId = this.productItemId;
    // this.prod["sizePack"]=form.value["sizePack"]
    if (this.unitNamePack) {
      this.prod["unitNamePack"] = this.unitNamePack;
    }
    console.log(this.prod);
    this.restApiService.updatePack(this.prod).subscribe(
      data => {
        console.log(data);
        this.modalController.dismiss("update");
      },
      err => {
        this.modalController.dismiss("error");
      }
    );
  }

  getProductItem(id) {
    this.restApiService.getOneProductItem(id).subscribe(data => {
      console.log(data);
      // this.productItemId = data["docs"][0]["_id"];
    });
  }

  unitMeasure(ev: Event) {
    console.log(ev.target["value"]);
    this.unitNamePack = ev.target["value"];
  }
}
