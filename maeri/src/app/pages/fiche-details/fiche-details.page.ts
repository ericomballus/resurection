import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FichePointage } from 'src/app/models/fichepointage.model';
import { FichepointageService } from 'src/app/services/fichepointage.service';

@Component({
  selector: 'app-fiche-details',
  templateUrl: './fiche-details.page.html',
  styleUrls: ['./fiche-details.page.scss'],
})
export class FicheDetailsPage implements OnInit {
  fiche: FichePointage;
  totalPrice = 0;
  totalQuantity = 0;
  constructor(
    private ficheService: FichepointageService,
    private location: Location
  ) {}

  ngOnInit() {
    this.fiche = this.ficheService.getLocalFichePointage();
    console.log(this.fiche);
    this.fiche.list.forEach((prod) => {
      if (!prod['ventes']) {
        prod['ventes'] = 0;
      }
      this.totalPrice = this.totalPrice + prod.ventes * prod.sellingPrice;
    });
  }
}
