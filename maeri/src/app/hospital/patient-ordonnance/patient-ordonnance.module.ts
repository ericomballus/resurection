import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientOrdonnancePageRoutingModule } from './patient-ordonnance-routing.module';

import { PatientOrdonnancePage } from './patient-ordonnance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientOrdonnancePageRoutingModule
  ],
  declarations: [PatientOrdonnancePage]
})
export class PatientOrdonnancePageModule {}
