import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserContratPageRoutingModule } from './user-contrat-routing.module';

import { UserContratPage } from './user-contrat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserContratPageRoutingModule
  ],
  declarations: [UserContratPage]
})
export class UserContratPageModule {}
