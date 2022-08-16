import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateContratPageRoutingModule } from './update-contrat-routing.module';

import { UpdateContratPage } from './update-contrat.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateContratPageRoutingModule,
    NgbModule,
  ],
  declarations: [UpdateContratPage],
})
export class UpdateContratPageModule {}
