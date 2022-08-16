import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FicheDetailsPageRoutingModule } from './fiche-details-routing.module';

import { FicheDetailsPage } from './fiche-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FicheDetailsPageRoutingModule
  ],
  declarations: [FicheDetailsPage]
})
export class FicheDetailsPageModule {}
