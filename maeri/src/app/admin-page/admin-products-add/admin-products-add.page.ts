import { Component, OnInit } from "@angular/core";
import { CatService } from "src/app/services/cat.service";
import { RestApiService } from "src/app/services/rest-api.service";
import {
  ModalController,
  NavParams,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { environment, uri } from "../../../environments/environment";
import { MadebyService } from "src/app/services/madeby.service";

@Component({
  selector: "app-admin-products-add",
  templateUrl: "./admin-products-add.page.html",
  styleUrls: ["./admin-products-add.page.scss"],
})
export class AdminProductsAddPage implements OnInit {
  file: File;
  url: any;
  isLoading: any;
  //flag_product: any;
  description: string;
  categorys: Array<any>;
  categorystab: Array<any>;
  mades: Array<any>;
  madeselect: any;
  productId: any;
  products: any;
  flag: any;
  data: any;
  database: any;
  unitName: any;
  constructor(
    private categorieSerice: CatService,
    private madebyService: MadebyService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    this.getMade();
    this.getCategories();
    this.takeMaeriProducts();
  }

  ngOnInit() {}
  getCategories() {
    this.categorieSerice.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categorys = data["category"];
    });
  }

  getMade() {
    this.madebyService.getMarieMadeby().subscribe((data) => {
      console.log(data);
      this.mades = data["madeby"];
    });
  }

  test(ev: Event) {
    console.log(ev);
    console.log(ev.target["value"]);
    this.productId = ev.target["value"];

    this.categorystab = this.categorys.filter(
      (item) => item["_id"] === this.productId
    )[0];

    console.log(this.categorystab);
  }

  made(ev: Event) {
    // console.log(ev.target["value"]);

    this.madeselect = this.mades.filter(
      (item) => item["_id"] === ev.target["value"]
    )[0]["name"];
  }

  readUrl(event: any) {
    // this.flag_product = "ok";
    this.file = event.target.files[0];
    //console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async register(form) {
    console.log(form.value);

    this.presentLoading();
    var formData = new FormData();
    //form.value["productId"] = this.product["_id"];
    await formData.append("produceBy", this.madeselect);
    await formData.append("categoryId", this.categorystab["_id"]);
    await formData.append("categoryName", this.categorystab["name"]);
    await formData.append("name", form.value.name);
    await formData.append("capacity", form.value.capacity);
    await formData.append("purchasingPrice", form.value.purchasingPrice);
    await formData.append("sellingPrice", form.value.sellingPrice);
    await formData.append("description", form.value.description);
    await formData.append("packSize", form.value.packSize);
    await formData.append("packPrice", form.value.packPrice);
    await formData.append("ristourne", form.value.ristourne);

    if (form.value.sizeUnit) {
      await formData.append("sizeUnit", form.value.sizeUnit);
    }
    if (this.unitName) {
      await formData.append("unitName", this.unitName);
    }

    await formData.append("image", this.file);
    console.log("formData here", formData);

    this.restApi.addMaeriProduct(formData).subscribe((data) => {
      console.log(data);
      form.reset();
      this.dismissLoading();
      this.presentToast();
    });
  }

  takeMaeriProducts() {
    this.restApi.getMaeriProduct().subscribe((data) => {
      console.log(data);
    });
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log("dismissed"));
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been save.`,
      duration: 2000,
      position: "top",
      animated: true,
      cssClass: "my-custom-class",
    });
    toast.present();
  }
  unitMeasure(ev) {
    //console.log(ev);
    // console.log(ev.target["value"]);
    this.unitName = ev.target["value"];
  }
}
