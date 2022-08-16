import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratDetailsPageRoutingModule } from './contrat-details-routing.module';

import { ContratDetailsPage } from './contrat-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContratDetailsPageRoutingModule
  ],
  declarations: [ContratDetailsPage]
})
export class ContratDetailsPageModule {}
