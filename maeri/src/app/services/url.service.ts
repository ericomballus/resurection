import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, uri } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
//import { CacheService } from "ionic-cache";
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot/ngx';
declare var ARP: any;

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  uriPro: any;
  urlTest: any;
  urls: any;
  urlForEvent = new BehaviorSubject(uri);
  localUrl: any;
  urlSubject = new BehaviorSubject(uri);
  tabRoles = [];
  prodMode = false;
  testMode = false;
  constructor(private hotspot: Hotspot) {
    let uriTest = 'http://localhost:3030/';
    //let uriTest = 'http://192.168.1.155:3000/';
    // let uriTest = 'http://18.157.225.135:3000/';
    //let uriTest = 'https://warm-caverns-20968.herokuapp.com/';
    if (localStorage.getItem('localIp')) {
      let ip = localStorage.getItem('localIp');
      uriTest = `http://${ip}:3030/`;
    }
    if (environment.production) {
      // this.uriPro = data[0]["url"];
      this.uriPro = uriTest;
      this.urlSubject.next(this.uriPro);
      this.urlForEvent.next(this.uriPro);

      this.urlTest = uriTest;
      this.urls = uriTest;
      this.urlSubject.next(this.urlTest);
      this.urlForEvent.next(this.urlTest);
    } else {
      this.urlForEvent.next(uri);
      this.urlSubject.next(uri);
    }

    /* this.db
      .list('urls')
      .valueChanges()
      .subscribe((data) => {
        console.log(data);
        data.forEach((elt) => {
          if (elt['url']) {
          }
          if (elt['urlTest']) {
            if (environment.production) {
              // this.uriPro = data[0]["url"];
              this.uriPro = elt['urlTest'];
              this.urlSubject.next(this.uriPro);
              this.urlForEvent.next(this.uriPro);
              console.log('developpement========');
              this.urlTest = elt['urlTest'];
              this.urls = elt['urlTest'];
              this.urlSubject.next(this.urlTest);
              this.urlForEvent.next(this.urlTest);
            } else {
              this.urlForEvent.next(uri);
              this.urlSubject.next(uri);
            }
          }
        });
      });*/
  }

  getUrl() {
    return this.urlSubject;
  }
  getUrlEvent() {
    console.log('====events===========');

    return this.urlForEvent;
  }

  setTestServer() {
    this.urlSubject.next(this.urlTest);
    this.urlForEvent.next(this.urlTest);
    this.testMode = true;
    console.log('urltestserveur');
  }

  useLocalServer(mac) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));

    if (this.tabRoles.includes(5)) {
      ARP.getIPFromMac(mac, (resp) => {
        let ip = `http://${resp['ip']}:3000/`;

        this.urlSubject.next(ip);
      });
    } else {
    }
  }
  restoreUrl() {
    if (environment.production) {
      this.urlSubject.next(this.uriPro);
      this.urlForEvent.next(this.uriPro);
    } else {
      this.urlForEvent.next(uri);
      this.urlSubject.next(uri);
    }
  }
  useWifiIp(company) {
    // this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    // ARP.getIPFromMac("5e:77:76:c4:e8:52", (resp) => {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));

    if (this.tabRoles.includes(5)) {
      let ip = `http://${company['ip']}:3000/`;
      this.urlSubject.next(ip);
    } else {
      // alert("tab role error");
    }
  }

  useDesktop(company) {
    // this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    // ARP.getIPFromMac("5e:77:76:c4:e8:52", (resp) => {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));

    if (this.tabRoles.includes(5)) {
      this.urlSubject.next(this.urlTest);
    } else {
      // alert("tab role error");
    }
  }

  restoreUrlOnline() {
    if (this.testMode) {
      this.urlSubject.next(this.urlTest);
      this.testMode = false;
    } else {
      this.urlSubject.next(this.uriPro);
    }
  }
  changeLocalServerIp(ip) {
    let uri = '';
    if (ip.split(':3000') && ip.split(':3000').length == 2) {
      let ipi = ip.split(':3000')[0];
      uri = `http://${ipi}:3000/`;
      localStorage.setItem('localIp', ipi);
    } else {
      uri = `http://${ip}:3030/`;
      localStorage.setItem('localIp', ip);
    }
    console.log(uri);

    this.urlSubject.next(uri);
    this.urlForEvent.next(uri);
  }
}
