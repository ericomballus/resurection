import { Component, OnInit } from "@angular/core";
import { CatService } from "../services/cat.service";
import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-category-super",
  templateUrl: "./category-super.page.html",
  styleUrls: ["./category-super.page.scss"],
})
export class CategorySuperPage implements OnInit {
  categories: any;
  tabRoles = [];
  admin: boolean = false;
  constructor(
    private catService: CatService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (this.tabRoles.includes(1)) {
      this.getCategories();
      this.admin = true;
    }
  }
  ngOnInit() {}

  register(form) {
    console.log(form.value);
    this.catService.addUserCategoriesSup(form.value).subscribe((data) => {
      // console.log(data);
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
    this.catService.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.categories = data["category"];
    });
  }

  deleteCategories(cat) {
    this.catService.deleteCategoriesSup(cat._id).subscribe((data) => {
      console.log(data);
      this.getCategories();
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
