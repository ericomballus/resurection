import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  id: any;
  database: any;
  url: string = 'http://192.168.100.10:3000/';
  categorieList: any[] = [];

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.id = localStorage.getItem('adminId');
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        console.log('url', this.url);
      });
    } else {
      this.url = uri;
    }
  }

  setCategorie(data) {
    this.categorieList = data;
  }
  getLocalCategorie() {
    if (this.categorieList == null || this.categorieList == undefined) {
      return [];
    } else {
      return this.categorieList;
    }
  }

  addExpenseCategories(data) {
    this.id = localStorage.getItem('adminId');
    data['adminId'] = this.id;
    return this.http.post(this.url + `expenses_type?db=${this.id}`, data);
  }

  getExpenseCategories(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(this.url + `expenses_type?db=${this.id}`);
  }

  deleteExpenseCategories(catId) {
    this.id = localStorage.getItem('adminId');
    return this.http.delete(this.url + `expenses_type/${catId}?db=${this.id}`);
  }

  postExpense(data) {
    this.id = localStorage.getItem('adminId');
    data['adminId'] = this.id;
    return this.http.post(this.url + `expenses?db=${this.id}`, data);
  }
  getExpense(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(this.url + `expenses?db=${this.id}`);
  }

  getExpenseByDate(data): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `expenses/byDate?db=${this.id}&start=${data.start}&end=${data.end}`
    );
  }
  deleteExpense(data) {
    this.id = localStorage.getItem('adminId');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers, body: data };
    return this.http.delete(this.url + `expenses?db=${this.id}`, options);
  }
}
