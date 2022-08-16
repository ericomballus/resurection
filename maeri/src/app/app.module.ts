import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { uri } from '../environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
let config: SocketIoConfig = { url: uri, options: {} };
/*
const config: SocketIoConfig = {
  url: "http://ec2-18-194-208-2.eu-central-1.compute.amazonaws.com:3000/",
  options: {}
}; */
//ec2-52-59-243-171.eu-central-1.compute.amazonaws.com
import { ProductUpdatePageModule } from '../app/product-update/product-update.module';
import { EmployeeAddPageModule } from './employees/employee-add/employee-add.module';
import { ProductItemModalPageModule } from '../app/product-item-modal/product-item-modal.module';
import { ProductPackItemModalPageModule } from '../app/product-pack-item-modal/product-pack-item-modal.module';
import { CartPageModule } from '../app/cart/cart.module';
import { CustomerModalPageModule } from '../app/customer-modal/customer-modal.module';
import { DatabasePageModule } from '../app/database/database.module';
import { AdminConfigPageModule } from './admin-page/admin-config/admin-config.module';
import { EmployeesViewUpdatePageModule } from './employees/employees-view-update/employees-view-update.module';
import { ProductAddPageModule } from './product/product-add/product-add.module';
import { ProductPackItemDetailsPageModule } from './product/product-pack-item-details/product-pack-item-details.module';
import { ProductManufacturedItemAddPageModule } from './product/product-manufactured-item-add/product-manufactured-item-add.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './translate-config.service';
import { DetailsPageModule } from './point-of-sale/details/details.module';
import { ConfimOrderPageModule } from './confim-order/confim-order.module';
//import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Drivers } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { WebServer } from '@ionic-native/web-server/ngx';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
//import { OpenNativeSettings } from "@ionic-native/open-native-settings/ngx";
import { environment } from '../environments/environment';

import { IonicImageLoader } from 'ionic-image-loader';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PickProductPageModule } from './pick-product/pick-product.module';
import { PickResourcePageModule } from './pick-resource/pick-resource.module';
import { ProductResourceUpdatePageModule } from './product-resource-update/product-resource-update.module';
import { DisplayResourcePageModule } from './display-resource/display-resource.module';
import { UrlService } from '../app/services/url.service';

import { MonitoringPageModule } from './monitoring/monitoring.module';
//import { ThermalPrintModule } from "ng-thermal-print";
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { Geofence } from "@ionic-native/geofence/ngx";
//import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { ShareModule } from './share.module';
import { AdminProductUpdatePageModule } from './admin-page/admin-product-update/admin-product-update.module';
import { ProductManufacturedUserPageModule } from './product/product-manufactured-user/product-manufactured-user.module';
import { OrderDetailsPageModule } from './order-details/order-details.module';
import { CancelOrderPageModule } from './point-of-sale/cancel-order/cancel-order.module';
import { DisplayInvoicePageModule } from './display-invoice/display-invoice.module';
import { BillardAddPageModule } from './billard-add/billard-add.module';
import { ShopPageModule } from './shop/shop.module';
import { AjouteemployePageModule } from './ajouteemploye/ajouteemploye.module';
import { PlatListPageModule } from './plat-list/plat-list.module';
//import { StarPRNT } from "@ionic-native/star-prnt/ngx";
//import { Printer } from "@ionic-native/printer/ngx";
import { HTTP } from '@ionic-native/http/ngx';
import { WebSocketServer } from '@ionic-native/web-socket-server';
//import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

//import { FCM } from "@ionic-native/fcm/ngx";
//import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { PopComponent } from './popovers/pop/pop.component';
//import { FCM } from "@ionic-native/fcm/ngx";
//import { BackgroundMode } from "@ionic-native/background-mode/ngx";
//import { Autostart } from "@ionic-native/autostart/ngx";
//import { ServiceWorkerModule } from "@angular/service-worker";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
//import { ThermalPrintModule } from "ng-thermal-print";
//import { NgxPrintModule } from "ngx-print";
import { HttpConfigInterceptor } from './httpConfig.interceptor';
import { PrintConfigPageModule } from './print-config/print-config.module';
import { RavitaillementPageModule } from './ravitaillement/ravitaillement.module';
import { MypopComponent } from './popovers/mypop/mypop.component';
//import { NgxElectronModule } from 'ngx-electron';
//import { ThermalPrintModule } from "ng-thermal-print";
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, PopComponent, MypopComponent],
  entryComponents: [PopComponent, MypopComponent],

  imports: [
    // ThermalPrintModule,
    // NgxPrintModule,
    SocketIoModule.forRoot(config),
    BrowserModule,

    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    // SocketIoModule.forRoot(config),
    NgbModule,
    ProductUpdatePageModule,
    ProductItemModalPageModule,
    ProductPackItemModalPageModule,
    CartPageModule,
    EmployeeAddPageModule,
    EmployeesViewUpdatePageModule,
    CustomerModalPageModule,
    DatabasePageModule,
    AdminConfigPageModule,
    ProductAddPageModule,
    ConfimOrderPageModule,
    ProductPackItemDetailsPageModule,
    ProductManufacturedItemAddPageModule,
    ProductManufacturedUserPageModule,
    PickProductPageModule,
    DetailsPageModule,
    ProductResourceUpdatePageModule,
    DisplayResourcePageModule,
    PickResourcePageModule,
    MonitoringPageModule,
    //  ThermalPrintModule,
    ShareModule,
    NgbModule,

    AdminProductUpdatePageModule,
    DisplayInvoicePageModule,
    OrderDetailsPageModule,
    CancelOrderPageModule,
    BillardAddPageModule,
    // ShopPageModule,
    AjouteemployePageModule,
    PlatListPageModule,
    PrintConfigPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot(),
    /* ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),*/
    // NgxElectronModule,
  ],
  exports: [],
  providers: [
    StatusBar,
    TranslateConfigService,
    Geolocation,
    // Geofence,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    WebServer,
    Hotspot,
    NetworkInterface,
    // OpenNativeSettings,
    WebView,

    HTTP,
    File,
    FileTransfer,
    FileOpener,

    {
      provide: LOCALE_ID,
      useValue: 'fr', // 'de' for Germany, 'fr' for France ...
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
