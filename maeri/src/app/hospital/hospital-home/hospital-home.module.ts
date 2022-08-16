import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HospitalHomePageRoutingModule } from './hospital-home-routing.module';

import { HospitalHomePage } from './hospital-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HospitalHomePageRoutingModule
  ],
  declarations: [HospitalHomePage]
})
export class HospitalHomePageModule {}
