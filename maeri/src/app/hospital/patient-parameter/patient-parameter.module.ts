import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientParameterPageRoutingModule } from './patient-parameter-routing.module';

import { PatientParameterPage } from './patient-parameter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientParameterPageRoutingModule
  ],
  declarations: [PatientParameterPage]
})
export class PatientParameterPageModule {}
