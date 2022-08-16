import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "src/app/services/auth-service.service";
import { NavParams, ToastController, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/services/admin.service";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/translate-config.service";

@Component({
  selector: "app-employees-update-password",
  templateUrl: "./employees-update-password.page.html",
  styleUrls: ["./employees-update-password.page.scss"],
})
export class EmployeesUpdatePasswordPage implements OnInit {
  // employee: { password: "aaaa"; newPassword: "aaaa" };
  employee: any;
  constructor(
    public authService: AuthServiceService,
    //navParams: NavParams,
    public toastController: ToastController,
    public modalController: ModalController,
    public adminService: AdminService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService
  ) {
    //console.log("le storage", JSON.parse(localStorage.getItem("user")));
    console.log(JSON.parse(localStorage.getItem("user")));
    //JSON.parse( localStorage.getItem( key ) );
    this.employee = JSON.parse(localStorage.getItem("user"));
    this.languageChanged();
  }

  ngOnInit() {}
  register(form) {
    console.log(form.value);
    form.value["id"] = this.employee["_id"];
    this.authService.employeeUpdatePassword(form.value).subscribe(
      (data) => {
        console.log(data);
        this.presentToast(data["result"]["name"]);
      },
      (err) => {
        console.log(err);
        // this.presentToast2();
      }
    );
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: `${msg} have been saved.`,
      duration: 2000,
      position: "top",
      animated: true,
      cssClass: "my-custom-class",
    });
    toast.present();
  }

  languageChanged() {
    //  console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
}
