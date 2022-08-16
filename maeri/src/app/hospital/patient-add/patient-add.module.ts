import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientAddPageRoutingModule } from './patient-add-routing.module';

import { PatientAddPage } from './patient-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientAddPageRoutingModule
  ],
  declarations: [PatientAddPage]
})
export class PatientAddPageModule {}
