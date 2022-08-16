import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { environment, uri } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ConsigneManagerService {
  url: string = 'http://192.168.100.10:3000/';
  id: any;
  database: any;
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
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

  getAllConsigne() {
    const id = localStorage.getItem('adminId');
    return this.http.get(
      `${this.url}consigne/${this.id}?db=${this.database}&allCustomer=${1}`
    );
  }

  getUserConsigne(customerId) {
    const id = localStorage.getItem('adminId');
    return this.http.get(
      `${this.url}consigne/${this.id}?db=${
        this.database
      }&byCustomer=${1}&customerId=${customerId}`
    );
  }

  updateConsigne(row) {
    const id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}consigne/${this.id}/consigne?db=${this.database}`,
      row
    );
  }
}
