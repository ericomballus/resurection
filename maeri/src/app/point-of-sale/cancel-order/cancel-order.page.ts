import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController, AlertController } from "@ionic/angular";
import { RestApiService } from "src/app/services/rest-api.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
@Component({
  selector: "app-cancel-order",
  templateUrl: "./cancel-order.page.html",
  styleUrls: ["./cancel-order.page.scss"],
})
export class CancelOrderPage implements OnInit {
  order: any;
  onAccount: Boolean = false;
  partially: Boolean = false;
  annule: Boolean = false;
  user: any = {
    name: "",
    phone: 0,
    motif: "",
  };
  ionicForm: FormGroup;
  constructor(
    public restApiService: RestApiService,
    private modalController: ModalController,
    navParams: NavParams,
    public alertController: AlertController,
    public formBuilder: FormBuilder
  ) {
    this.order = navParams.get("order");
    console.log(this.order);
    if (this.order.onAccount) {
      this.onAccount = true;
    }
    if (this.order.partially) {
      this.partially = true;
    }

    if (this.order.annule) {
      this.annule = true;
    }
  }
  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get("dob").setValue(date, {
      onlyself: true,
    });
  }
  ngOnInit() {
    this.ionicForm = new FormGroup({
      name: new FormControl(),
      phone: new FormControl(),
      ville: new FormControl(),
      quartier: new FormControl(),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  suggestion(ev) {
    console.log(ev);
    this.user.motif = ev.detail.value;
  }

  valider() {
    if (this.user.name.length >= 2 && this.user.phone.length >= 9) {
      this.order.custumerName = this.user.name;
      this.order.custumerPhone = this.user.phone;
      if (this.onAccount) {
        this.order.onAccount = true;
      }
      if (this.partially) {
        this.order.partially = true;
        this.order.avance = this.order.commande.montantRecu;
        this.order.reste = this.order.commande.reste;
      }
      this.order.user = this.user;
      let tab = [];
      tab = JSON.parse(localStorage.getItem(`userCommande`));
      if (tab && tab.length) {
        // alert(tab.length);
        // alert(JSON.stringify(tab));
        let index = tab.findIndex((elt) => {
          return elt.localId == this.order.localId;
        });
        if (index >= 0) {
          tab.splice(index, 1, this.order);
          localStorage.setItem(`userCommande`, JSON.stringify(tab));
        }
      }
      this.modalController.dismiss(this.order);
    } else {
      this.confirmError();
    }
  }

  valider2() {
    if (this.user.motif) {
      this.order.user = this.user;
      this.order.invoiceCancel = true;
      let tab = [];
      tab = JSON.parse(localStorage.getItem(`userCommande`));
      if (tab && tab.length) {
        // alert(tab.length);
        // alert(JSON.stringify(tab));
        let index = tab.findIndex((elt) => {
          return elt.localId == this.order.localId;
        });
        if (index >= 0) {
          tab.splice(index, 1, this.order);
          localStorage.setItem(`userCommande`, JSON.stringify(tab));
        }
      }
      this.modalController.dismiss(this.order);
    } else {
      this.confirmError();
    }
  }

  validation() {
    // console.log(this.order.commande.reste);
    console.log(this.ionicForm.value);

    this.user = this.ionicForm.value;
    if (this.order.commande.reste < 0) {
      this.confirmBuyAcredit();
    } else {
      this.confirmCancel();
    }
  }
  async confirmCancel() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      message: "Annuler la commande?",
      buttons: [
        {
          text: "NO",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "OK",
          handler: () => {
            console.log(this.order);
            this.valider();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmBuyAcredit() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      message: "vous confirmez l'operation",
      buttons: [
        {
          text: "NO",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "OK",
          handler: () => {
            console.log(this.order);
            this.valider();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmError() {
    const alert = await this.alertController.create({
      // cssClass: "my-custom-class",
      header: "suppression impossible!",
      message: "les informations entrées sont incomplétes",
      buttons: [
        {
          text: "OK",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
}
