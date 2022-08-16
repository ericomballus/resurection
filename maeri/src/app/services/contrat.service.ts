import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contrat } from '../models/contrat.model';
import { OfflineManagerService } from './offline-manager.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class ContratService {
  url: string = 'http://192.168.100.10:3000/';
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.takeUrl();
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
    });
  }
  postContrat(data) {
    return this.http.post(this.url + `contrat`, data);
  }

  getContrat(userId) {
    return this.http.get(this.url + `contrat/${userId}`);
  }

  updateContrat(data: Contrat) {
    return this.http.patch(this.url + `contrat/`, data);
  }
  deleteContrat(id) {
    return this.http.delete(this.url + `contrat/${id}`);
  }
}
