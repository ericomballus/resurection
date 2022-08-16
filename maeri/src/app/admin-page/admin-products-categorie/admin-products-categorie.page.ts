import { Component, OnInit } from "@angular/core";
import { CatService } from "../../services/cat.service";
import { ModalController, AlertController } from "@ionic/angular";
@Component({
  selector: "app-admin-products-categorie",
  templateUrl: "./admin-products-categorie.page.html",
  styleUrls: ["./admin-products-categorie.page.scss"],
})
export class AdminProductsCategoriePage implements OnInit {
  categories: any;
  tabRoles = [];
  del = true;
  constructor(
    private catService: CatService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getCategories();
  }
  register(form) {
    console.log(form.value);
    this.catService.addMaeriCategories(form.value).subscribe((data) => {
      // console.log(data);
      form.reset();
      this.getCategories();
      //  this.presentAlert();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "MAERI",
      message: "success!!!!",
      buttons: ["OK"],
    });

    await alert.present();
  }

  getCategories() {
    this.catService.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categories = data["category"];
    });
  }

  deleteCategories(cat) {
    let id = cat._id;
    this.catService.deleteMaeriCategories(cat._id).subscribe((data) => {
      console.log(data);
      //  this.getCategories();
      this.categories = this.categories.filter((elt) => {
        return elt._id !== id;
      });
      // this.categories.splice(index, 1, data);
    });
  }

  async createCategory() {
    const alert = await this.alertController.create({
      header: "MAERI",
      message: "success!!!!",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
