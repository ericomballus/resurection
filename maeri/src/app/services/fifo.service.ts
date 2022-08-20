import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { SaverandomService } from './saverandom.service';
import { UrlService } from './url.service';
import { environment, uri } from '../../environments/environment';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class FifoService {
  url: string = 'http://192.168.100.10:3000/';
  id: any;
  database: any;
  userName: String = 'unknown';
  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private saveRandom: SaverandomService
  ) {
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }

  enableStock(stock) {
    return this.http.patch(
      `${this.url}fifo/enable/${stock._id}?db=${stock.adminId}`,
      stock
    );
  }
  desableStock(stock) {
    return this.http.patch(
      `${this.url}fifo/stock/desable/${stock._id}?db=${stock.adminId}`,
      stock
    );
  }

  getProductAvaibleStock(productId) {
    const id = localStorage.getItem('adminId');
    return this.http.get(`${this.url}fifo/${id}/${productId}?db=${id}`);
  }
  getStockExpirationDate(stockId) {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}fifo/stock/expired/${stockId}?db=${id}`);
  }

  getParameter(data: Patient) {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}parameter/${id}/${data._id}?db=${id}`);
  }

  getPatientBills(customerId) {
    let adminId = localStorage.getItem('adminId');
    let URL =
      this.url +
      `bill/admin/${adminId}?db=${adminId}&isPatient=${true}&customerId=${customerId}`;

    return this.http.get(URL);
  }

  //hospitalisation ************************
}
