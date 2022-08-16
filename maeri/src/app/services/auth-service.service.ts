import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NetworkService, ConnectionStatus } from "./network.service";
import { Storage } from "@ionic/storage";
import { Observable, from, of } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { OfflineManagerService } from "./offline-manager.service";
const API_STORAGE_KEY = "specialkey";
import { User } from "../models/user";
import { environment, uri } from "../../environments/environment";
import { UrlService } from "./url.service";
//import { IonicStorageModule } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  isLoggedIn = false;
  token: any;
  id: any;
  database: any;
  url: string = "http://192.168.100.10:3000/";
  url2: string = "http://192.168.100.10:3000/";
  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private urlService: UrlService
  ) {
    this.id = localStorage.getItem("adminId");
    this.takeUrl();
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
    });
  }

  login(data: User) {
    // console.log(data);
    this.urlService.getUrl().subscribe((res) => {
      this.url = res;
    });
    this.database = localStorage.getItem("adminemail");
    // alert(url);
    return this.http.post(`${this.url}users/login`, data);
  }

  loginEmploye(data) {
    // console.log(data);
    // alert(this.url);
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
    } else {
    }
    return this.http.post(this.url + `employe/login`, data);
  }
  register(data: User) {
    return this.http.post(this.url + "users/signup", data);
  }

  addEmployee(data: User) {
    this.id = localStorage.getItem("adminId");
    // return this.http.post(this.url + `users/employe/${this.id}`, data);
    return this.http.post(this.url + `employe/signup/${this.id}`, data);
  }

  getEmployees() {
    this.id = localStorage.getItem("adminId");
    return this.http.get(this.url + `employe/${this.id}`);
  }

  deleteEmploye(employeIdData) {
    this.id = localStorage.getItem("adminId");
    return this.http.delete(
      this.url + `employe/${this.id}/delete/${employeIdData}`
    );
  }

  deleteEmployeeRole(data) {
    this.id = localStorage.getItem("adminId");
    return this.http.post(
      this.url + `employe/delete/employe/role/${this.id}`,
      data
    );
  }

  addEmployeeRole(data) {
    console.log(data);
    data["employeId"] = data._id;
    this.id = localStorage.getItem("adminId");
    return this.http.put(
      this.url + `employe/add/employe/role/${this.id}`,
      data
    );
  }

  employeeUpdatePassword(data) {
    this.id = localStorage.getItem("adminId");
    return this.http.post(this.url + `employe/update/password`, data);
  }

  updateEmployee(data) {
    this.id = localStorage.getItem("adminId");
    return this.http.patch(this.url + `employe/${this.id}`, data);
  }

  getAdminAccount(id) {
    return this.http.get(this.url + `users/takeuser/${id}`);
  }
  getUser() {
    let Id = localStorage.getItem("adminId");
    return this.http.get(this.url + `users/${Id}`);
  }
}
