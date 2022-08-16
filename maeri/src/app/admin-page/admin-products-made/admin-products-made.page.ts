import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { MadebyService } from "src/app/services/madeby.service";

@Component({
  selector: "app-admin-products-made",
  templateUrl: "./admin-products-made.page.html",
  styleUrls: ["./admin-products-made.page.scss"],
})
export class AdminProductsMadePage implements OnInit {
  mades: any;
  tabRoles = [];
  constructor(
    private madebyService: MadebyService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getMadeBy();
  }
  register(form) {
    console.log(form.value);
    this.madebyService.addMaeriMadeby(form.value).subscribe((data) => {
      // console.log(data);
      this.getMadeBy();
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

  getMadeBy() {
    this.madebyService.getMarieMadeby().subscribe((data) => {
      console.log(data);
      this.mades = data["madeby"];
    });
  }

  deleteMade(cat) {
    console.log(cat);

    this.madebyService.deleteMaeriMadeby(cat._id).subscribe((data) => {
      console.log(data);
      this.getMadeBy();
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
