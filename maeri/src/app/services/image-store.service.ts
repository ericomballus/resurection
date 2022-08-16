import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { environment, uri } from '../../environments/environment';
import { Storage } from '@ionic/storage';

import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root',
})
export class ImageStoreService {
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

  postImages(data) {
    return new Promise((resolve, reject) => {
      let adminId = localStorage.getItem('adminId');
      this.http.post(`${this.url}images/?db=${adminId}`, data).subscribe(
        (res) => {
          resolve(res['url']);
        },
        (err) => {
          reject(err);
        }
      );
    });
    //
  }
}
