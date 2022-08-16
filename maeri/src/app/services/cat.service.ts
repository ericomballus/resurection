import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class CatService {
  //uri = "http://localhost:3000/";
  // uri = "http://ec2-52-59-243-171.eu-central-1.compute.amazonaws.com:3000/";

  id: any;
  database: any;
  url: string = 'http://192.168.100.10:3000/';

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

  addUserCategories(data) {
    this.id = localStorage.getItem('adminId');
    let database = localStorage.getItem('adminemail');
    return this.http.post(this.url + `category/${this.id}?db=${this.id}`, data);
  }

  addUserCategoriesSup(data) {
    console.log(data);
    this.id = localStorage.getItem('adminId');
    let database = localStorage.getItem('adminemail');
    return this.http.post(
      this.url + `supcategory/${this.id}?db=${this.id}`,
      data
    );
  }

  getCategories(): Observable<Object> {
    let database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    return this.http.get(this.url + `category/cat/${this.id}?db=${this.id}`);
  }

  getCategoriesSup(): Observable<Object> {
    let database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    return this.http.get(this.url + `supcategory/cat/${this.id}?db=${this.id}`);
  }

  updateCategories(cat) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(this.url + `category/${cat._id}?db=${this.id}`, cat);
  }

  deleteCategories(catId) {
    this.id = localStorage.getItem('adminId');
    return this.http.delete(
      this.url + `category/${catId}/${this.id}?db=${this.id}`
    );
  }
  deleteCategoriesSup(catId) {
    // let database = localStorage.getItem("adminemail");
    this.id = localStorage.getItem('adminId');
    return this.http.delete(
      this.url + `supcategory/${catId}/${this.id}?db=${this.id}`
    );
  }
  addMaeriCategories(data) {
    console.log(data);
    let database = localStorage.getItem('adminemail');
    return this.http.post(this.url + `maericategorie`, data);
  }
  getMarieCategories(): Observable<Object> {
    return this.http.get(this.url + `maericategorie/`);
  }

  deleteMaeriCategories(catId) {
    return this.http.delete(this.url + `maericategorie/${catId}/`);
  }
}
