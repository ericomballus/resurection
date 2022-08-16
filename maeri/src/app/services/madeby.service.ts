import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment, uri } from "../../environments/environment";
import { UrlService } from "./url.service";

@Injectable({
  providedIn: "root",
})
export class MadebyService {
  id: any;
  database: any;
  url: string = "http://192.168.100.10:3000/";
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.id = localStorage.getItem("adminId");
    this.database = localStorage.getItem("adminemail");
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }

  getCategories(): Observable<Object> {
    return this.http.get(
      this.url + `category/cat/${this.id}?db=${this.database}`
    );
  }

  deleteCategories(catId) {
    return this.http.delete(
      this.url + `category/${catId}/${this.id}?db=${this.database}`
    );
  }
  addMaeriMadeby(data) {
    console.log(data);
    return this.http.post(this.url + `madeby`, data);
  }
  getMarieMadeby(): Observable<Object> {
    return this.http.get(this.url + `madeby`);
  }

  deleteMaeriMadeby(catId) {
    return this.http.delete(this.url + `madeby/${catId}/`);
  }
}
