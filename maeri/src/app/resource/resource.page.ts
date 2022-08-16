import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

import { ModalController, AlertController } from "@ionic/angular";
import { ResourcesService } from "../services/resources.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-resource",
  templateUrl: "./resource.page.html",
  styleUrls: ["./resource.page.scss"],
})
export class ResourcePage implements OnInit {
  @ViewChild("form", { read: NgForm }) formulaire: NgForm;
  resources: any;
  tabRoles = [];
  admin: boolean = false;
  unitName: any;
  userStore = [];
  storeId;
  selection: string = "piece";
  originPage: String = "";
  constructor(
    private resourceService: ResourcesService,
    public modalController: ModalController,
    public alertController: AlertController,
    private route: ActivatedRoute
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (this.tabRoles.includes(1)) {
      this.getResources();
      this.admin = true;
      this.getStore();
    }
  }

  ngOnInit() {
    this.route.queryParams
      //.filter(params => params.order)
      .subscribe((params) => {
        console.log(params); // { order: "popular" }

        this.originPage = params.page;
        console.log(this.originPage); // popular
      });
  }

  getStore() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userStore = user[0]["storeId"];
    console.log(this.userStore);
    // let id = this.userStore[0]["id"];
  }
  ionViewDidEnter() {
    // localStorage.setItem("user", JSON.stringify(firstRes["user"]));
    let user = JSON.parse(localStorage.getItem("user"));
    this.userStore = user[0]["storeId"];
  }

  register(form) {
    if (this.unitName == "r") {
      console.log("rien");
    } else {
      form.value["unitName"] = this.unitName;
    }
    if (this.storeId) {
      form.value["storeId"] = this.storeId;
    } else {
      let id = this.userStore[0]["id"];
      form.value["storeId"] = id;
    }

    form.value["page"] = this.originPage;
    this.resourceService.addUserResources(form.value).subscribe((data) => {
      console.log(data);
      this.formulaire.reset();
      this.selection = null;
      this.getResources();
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

  getResources() {
    this.resourceService.getResources().subscribe((data) => {
      console.log(data);
      this.resources = data["resources"].filter((elt) => {
        if (elt.page) {
          return elt.page == this.originPage;
        }
      });
      // this.resources = data["resources"].reverse();
    });
  }

  deleteResources(cat) {
    this.resourceService.deleteResource(cat._id).subscribe((data) => {
      console.log(data);
      this.getResources();
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

  unitMeasure(ev: Event) {
    console.log(ev.target["value"]);
    this.unitName = ev.target["value"];
  }

  changeStore(ev: Event) {
    console.log(ev.target["value"]);
    let ids = ev.target["value"];
    this.storeId = ids;
    // console.log(this.storeList);

    /* let store = this.storeList.filter((str) => {
      return str["id"] == ids;
    }); */
    // console.log(store);

    // this.storeName = store[0]["name"];
  }
}
