import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class TranslateConfigService {
  constructor(private translate: TranslateService) {}

  getDefaultLanguage() {
    //let language = this.translate.getBrowserLang();
    // console.log("la langue ", language);
    let language = "fr";
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang) {
    this.translate.use(setLang);
  }
}
