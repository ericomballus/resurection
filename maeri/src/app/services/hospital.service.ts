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
export class HospitalService {
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

  postPatient(data) {
    const id = localStorage.getItem('adminId');
    let storeId = '';
    data['adminId'] = id;
    if (storeId) {
      console.log(storeId);
    }

    return this.http.post(`${this.url}patient?db=${id}`, data);
  }

  updatePatient(patient: Patient) {
    return this.http.patch(
      `${this.url}patient/${patient._id}?db=${patient.adminId}`,
      patient
    );
  }
  postParameters(data) {
    const id = localStorage.getItem('adminId');
    let storeId = '';
    data['adminId'] = id;

    return this.http.post(`${this.url}parameter/${id}?db=${id}`, data);
  }

  getAllPatient() {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}patient/${id}?db=${id}`);
  }
  getPatientAddToday() {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}patient/${id}?db=${id}&today=${true}`);
  }

  getParameter(data: Patient) {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}parameter/${id}/${data._id}?db=${id}`);
  }

  // handle Ordonnace request here :

  postOrdonnance(data) {
    const id = localStorage.getItem('adminId');
    let storeId = '';
    data['adminId'] = id;

    return this.http.post(`${this.url}ordonnance/${id}?db=${id}`, data);
  }
  getPatientOrdonnance(data: Patient) {
    const id = localStorage.getItem('adminId');

    return this.http.get(`${this.url}ordonnance/${id}/${data._id}?db=${id}`);
  }

  getPatientBills(customerId) {
    let adminId = localStorage.getItem('adminId');
    let URL =
      this.url +
      `bill/admin/${adminId}?db=${adminId}&isPatient=${true}&customerId=${customerId}`;

    return this.http.get(URL);
  }

  //hospitalisation ************************
  postHospitalisation(data) {
    const id = localStorage.getItem('adminId');
    let storeId = '';
    data['adminId'] = id;

    return this.http.post(`${this.url}hospitalisation/${id}?db=${id}`, data);
  }
  getHospitalisationPatient(patientId) {
    let adminId = localStorage.getItem('adminId');
    let URL =
      this.url + `hospitalisation/${adminId}/${patientId}?db=${adminId}`;

    return this.http.get(URL);
  }
  endHospitalisationPatient(data) {
    const id = localStorage.getItem('adminId');
    let storeId = '';
    data['adminId'] = id;

    return this.http.patch(
      `${this.url}hospitalisation/${data._id}?db=${id}`,
      data
    );
  }
}
