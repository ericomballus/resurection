import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';
import { SaverandomService } from './saverandom.service';
import { FichePointage } from '../models/fichepointage.model';
@Injectable({
  providedIn: 'root',
})
export class FichepointageService {
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  id: any;
  fiche: FichePointage;
  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private saveRandom: SaverandomService
  ) {
    this.takeUrl();
    this.id = localStorage.getItem('adminId');
    //  this.database = localStorage.getItem("adminemail");
    this.database = localStorage.getItem('adminId');
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

  postPointage(arr) {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    let data = {
      list: arr,
      storeId: storeId,
      adminId: adminId,
    };
    return this.http.post(`${this.url}fichepointage/?db=${adminId}`, data);
    //
  }

  getPointageList() {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    let storeId = this.saveRandom.getStoreId();
    if (!tabRoles) {
      tabRoles = [];
    }
    return this.http.get(
      `${this.url}fichepointage/?db=${this.database}&storeId=${storeId}`
    );
  }

  getLastFiche() {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    let storeId = this.saveRandom.getStoreId();
    if (!tabRoles) {
      tabRoles = [];
    }
    return this.http.get(
      `${this.url}fichepointage/${this.id}/last/close?db=${this.database}&storeId=${storeId}`
    );
  }

  getAllPointageList() {
    this.database = localStorage.getItem('adminId');
    return this.http.get(
      `${this.url}fichepointage/${this.database}/all?db=${this.database}`
    );
  }

  updateFichePointage(fiche: FichePointage) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(`${this.url}fichepointage/?db=${adminId}`, fiche);
  }

  deleteOneGamme(gamme) {
    let adminId = localStorage.getItem('adminId');
    return this.http.delete(
      `${this.url}gamme/${gamme._id}?db=${adminId}`,
      gamme._id
    );
    //
  }
  setFichePointage(data: FichePointage) {
    this.fiche = data;
  }

  getLocalFichePointage() {
    return this.fiche;
  }
}
