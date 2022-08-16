import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPatientPageRoutingModule } from './select-patient-routing.module';

import { SelectPatientPage } from './select-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPatientPageRoutingModule
  ],
  declarations: [SelectPatientPage]
})
export class SelectPatientPageModule {}
