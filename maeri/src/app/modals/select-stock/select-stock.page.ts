import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FifoService } from 'src/app/services/fifo.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-select-stock',
  templateUrl: './select-stock.page.html',
  styleUrls: ['./select-stock.page.scss'],
})
export class SelectStockPage implements OnInit {
  stockArr: any[] = [];
  constructor(
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    public modalController: ModalController,
    public fifoService: FifoService
  ) {}

  ngOnInit() {
    this.stockArr = this.saveRandom.getAvaibleStock();
    console.log(this.stockArr);
    this.stockArr.forEach((stock, index) => {
      this.fifoService
        .getStockExpirationDate(stock._id)
        .subscribe((expireDate) => {
          console.log(expireDate);
          this.stockArr[index]['remainingTime'] = expireDate;
        });
    });
  }
  closeModal() {
    this.modalController.dismiss();
  }

  async useStock(stock, i) {
    this.notifi.presentLoading();
    try {
      await this.findActifStock();
      this.fifoService.enableStock(stock).subscribe((res) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('stock activé', 'primary');
        stock.actif = true;
        this.stockArr.splice(i, 1, stock);
      });
    } catch (error) {
      this.notifi.dismissLoading();
      this.notifi.presentToast(
        "un stock est deja en cours d'utlisation désactiver le si vous souhaiter utiliser un autre",
        'danger'
      );
    }
  }

  findActifStock() {
    return new Promise((resolve, reject) => {
      let found = this.stockArr.find((stock) => stock.actif);
      if (!found) {
        resolve(found);
      } else {
        reject(null);
      }
    });
  }
  async desableStock(stock, i) {
    try {
      await this.notifi.presentAlertConfirm(
        'voulez vous vraiment desactiver le stock ?'
      );
      this.notifi.presentLoading();
      this.fifoService.desableStock(stock).subscribe((res) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('stock desactivé', 'primary');
        stock.actif = false;
        this.stockArr.splice(i, 1, stock);
      });
    } catch (error) {
      this.notifi.dismissLoading();
    }
  }
}
