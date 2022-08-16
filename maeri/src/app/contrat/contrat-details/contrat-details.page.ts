import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin.model';
import { Contrat } from 'src/app/models/contrat.model';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { NumberToLetter } from 'convertir-nombre-lettre';
import { ContratService } from 'src/app/services/contrat.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-contrat-details',
  templateUrl: './contrat-details.page.html',
  styleUrls: ['./contrat-details.page.scss'],
})
export class ContratDetailsPage implements OnInit {
  logo: null;
  facture: Contrat;
  admin: Admin;
  total_en_lettre: any;
  display_btn = false;
  constructor(
    private saveRandom: SaverandomService,
    public contratService: ContratService,
    public notifi: NotificationService
  ) {}

  ngOnInit() {
    this.facture = this.saveRandom.getUserBill();
    this.admin = this.saveRandom.getUserAdmin();
    console.log(this.admin);
    console.log(this.facture);
    this.total_en_lettre = NumberToLetter(this.facture.montant);
    if (!this.facture.status && localStorage.getItem('adminMaeri')) {
      this.display_btn = true;
    }
  }

  WindowPrint() {
    setTimeout(() => {
      window.print();
    }, 250);
    //
    // this.pied_page.nativeElement.style.display = 'block';
  }
  ConfirmPaiement() {
    this.facture.status = true;
    this.notifi.presentLoading();
    this.contratService.updateContrat(this.facture).subscribe((res) => {
      this.notifi.dismissLoading();
      this.notifi.presentToast(
        `paiment facture ${this.admin.company} enregistré !`,
        'primary'
      );
      console.log(res);
      this.saveRandom.setUserBill(this.facture);
    });
  }
}
