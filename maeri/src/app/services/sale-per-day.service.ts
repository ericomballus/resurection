import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from, of } from "rxjs";
import { environment, uri } from "../../environments/environment";
import { UrlService } from "./url.service";

@Injectable({
  providedIn: "root"
})
export class SalePerDayService {
  url: string = "http://192.168.100.10:3000/";
  database: any;
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.takeUrl();
  }

  getInvoiceNotPaieAdmin(onlyByDate) {
    this.database = localStorage.getItem("adminemail");
    let adminId = localStorage.getItem("adminId");
    let openCashDate = localStorage.getItem("openCashDate");
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${this.database}&openCashDate=${openCashDate}
          &onlyByDate=${onlyByDate}`
    );
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe(data => {
        this.url = data;
        console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }
}
