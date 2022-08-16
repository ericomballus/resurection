import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AdminService } from "src/app/services/admin.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: "app-display-store-customer",
  templateUrl: "./display-store-customer.page.html",
  styleUrls: ["./display-store-customer.page.scss"],
})
export class DisplayStoreCustomerPage implements OnInit {
  @Input() customer: any;
  nbrVisite = 0;
  lastVisite: Date = new Date(Date.now());
  constructor(
    public modalController: ModalController,
    private adminService: AdminService,
    public notif: NotificationService
  ) {}

  ngOnInit() {
    console.log(this.customer);
    this.getcustomerInvoices();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  getcustomerInvoices() {
    this.adminService.getInvoiceCustomer(this.customer._id).subscribe((res) => {
      this.nbrVisite = res["docs"].length;
      let lastInvoice = res["docs"][res["docs"].length - 1];
      if (lastInvoice && lastInvoice["created"]) {
        this.lastVisite = lastInvoice["created"];
      } else {
      }
    });
  }
}
