import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { UrlService } from './url.service';
import { environment, uri } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  url = 'http://localhost:3000/';
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.takeUrl();
  }

  infoInvoice(data) {
    // this.invoiceSubject.next(data);
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      console.log('url', this.url);
    });
    if (environment.production) {
      this.url = this.url;
    } else {
      this.url = uri;
    }
  }
  updateInvoice(url, items) {
    return this.http.patch(url, items);
    /*  let confirm = false;
    let Posconfirm = false;
    let tabRoles = JSON.parse(localStorage.getItem("roles"));
    let openCashDate = localStorage.getItem("openCashDate");
    let openCashDateId = JSON.parse(localStorage.getItem("openCashDateObj"))[
      "_id"
    ];
    /// console.log("idcash", localStorage.getItem("openCashDateObj"));

    if (tabRoles.includes(4)) {
      (confirm = true), (Posconfirm = true);
    }
    this.userName = JSON.parse(localStorage.getItem("user"))["name"];
    let adminId = localStorage.getItem("adminId");
    let data = {
      cart: items,
      adminId: this.id,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
    };
    let url =
      this.url +
      "invoice/commande/items/" +
      this.userName +
      "/" +
      adminId +
      "/" +
      "?db=" +
      this.database;

    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
    } else {
      console.log(items);

      return this.http
        .post(
          this.url +
            "invoice/commande/items/" +
            this.userName +
            "/" +
            adminId +
            "/" +
            "?db=" +
            this.database,
          {
            cart: items,
            adminId: this.id,

            confirm: confirm,
            Posconfirm: Posconfirm,
            openCashDate: openCashDate,

            openCashDateId: openCashDateId,
          }
        )
        .pipe(
          catchError((err) => {
            // this.offlineManager.storeRequest(url, "POST", data);
            console.log("ici error", err);
            let url =
              this.url +
              "invoice/commande/items/" +
              this.userName +
              "/" +
              adminId +
              "/" +
              "?db=" +
              this.database;

            return this.offlineManager.storeRequest(
              url,
              "POST",
              {
                cart: items,
                adminId: this.id,
                confirm: confirm,
                Posconfirm: Posconfirm,
                openCashDate: openCashDate,
                userName: this.userName,
                products: items["products"],
                commande: items,
                sale: false,
                created: Date.now(),
                openCashDateId: openCashDateId,
              }
              // throw new Error(err);
            );
          })
        );
    }  */
  }

  getInvoiceNotPaie(id) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `invoice/admin/findByUser/senderId/${adminId}/0/invoice/get/all?db=${adminId}&customerId=${id}`
    );
  }
}
