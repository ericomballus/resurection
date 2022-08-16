import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  id: any;
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  constructor(private http: HttpClient, private urlService: UrlService) {
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

  postBalance(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.post(`${this.url}balance?db=${adminId}`, data);
  }

  getCustomerBalance(customerId) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(`${this.url}balance/${customerId}?db=${adminId}`);
  }

  updateBalance(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(`${this.url}balance?db=${adminId}`, data);
  }
}
