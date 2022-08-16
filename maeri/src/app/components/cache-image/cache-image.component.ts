import { Component, Input, OnInit } from '@angular/core';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { Platform } from '@ionic/angular';
import { CachingService } from 'src/app/services/caching.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrinterService } from 'src/app/services/printer.service';
declare var cordova: any;
@Component({
  selector: 'app-cache-image',
  templateUrl: './cache-image.component.html',
  styleUrls: ['./cache-image.component.scss'],
})
export class CacheImageComponent implements OnInit {
  fileTransfer: FileTransferObject;
  _src = '';
  comming;
  @Input() spinner = false;
  @Input() isLoad = false;
  constructor(
    private platform: Platform,
    private printerService: PrinterService,
    private cacheService: CachingService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {}
  @Input()
  set src(imageUrl: string) {
    this.comming = imageUrl;

    if (this.platform.is('electron')) {
      this._src = imageUrl;
      // return;
      /* let tab = imageUrl.split('/');
      let fileId = tab.pop().split('?').shift();
      let path = `${fileId}`;

      this.cacheService
        .checkImages({ url: imageUrl, filename: path })
        .then((URL: string) => {
          this._src = URL;
        })
        .catch((err) => {
          console.log(err);
          this.cacheService
            .saveImagesToLocalServer({
              url: imageUrl,
              filename: path,
            })
            .then((res: string) => {
              this._src = res;
            })
            .catch((err) => {
              console.log('error here', err);
            });
        });*/
    } else if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      //  this._src = imageUrl;

      this._src = imageUrl;
    } else if (this.platform.is('android')) {
      // this._src = imageUrl;
      this._src = '';
      //this._src = imageUrl;

      let tab = imageUrl.split('/');
      let fileId = tab.pop().split('?').shift();
      let path = `${fileId}.png`;
      this.printerService
        .checkFileExist(path)
        .then((res) => {
          this.printerService
            .loadUrl(path)
            .then((url: string) => {
              if (url) {
                this._src = url;
              }
            })
            .catch((err) => {
              this._src = '../../assets/noimage.png';
              this.notifi.presentToast(
                `impossible de lire le chemein de l'image ${path}`,
                'danger'
              );
            });
        })
        .catch((err) => {
          this.printerService
            .downloadItemsImages(imageUrl, path)
            .then((URL) => {
              /*if (URL) {
                this._src = URL;
              } */
              this.printerService
                .loadUrl(path)
                .then((url: string) => {
                  if (url) {
                    this._src = url;
                  }
                })
                .catch((err) => {
                  this._src = '../../assets/noimage.png';
                  this.notifi.presentToast(
                    `impossible de lire le chemein de l'image ${path}`,
                    'danger'
                  );
                });
            })
            .catch((err) => {
              this._src = '../../assets/noimage.png';
              this.notifi.presentToast(
                `impossible de telecharger l'image ${imageUrl}`,
                'danger'
              );
            });
        });
      /*  setTimeout(() => {
        this.printerService.downloadItemsImages(imageUrl, path).then((URL) => {
          this._src = URL;
        });
      }, 20000); */
    }
  }

  noImageLoad() {
    let imageUrl = this._src;
    console.log('error find this', this._src);

    let tab = imageUrl.split('/');
    let fileId = tab.pop().split('?').shift();
    let path = `${fileId}`;
    // this._src = '';
    // this._src = '../../assets/noimage.png';
    /* setTimeout(() => {
      this._src = '../../assets/noimage.png';
    }, 10000);*/
    if (this.platform.is('electron')) {
      this._src = '';
      setTimeout(() => {}, 6000);
    }

    if (this.platform.is('desktop') || this.platform.is('android')) {
      this._src = '../../assets/noimage.png';
      // setTimeout(() => {
      // this._src = '../../assets/noimage.png';
      // console.log('refresh', this.comming);

      //  }, 6000);
    }

    if (this.platform.is('android')) {
      this._src = '../../assets/noimage.png';
      // setTimeout(() => {
      // this._src = '../../assets/noimage.png';
      // console.log('refresh', this.comming);

      //  }, 6000);
    }
  }
}
