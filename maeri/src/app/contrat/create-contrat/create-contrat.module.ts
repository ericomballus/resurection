import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateContratPageRoutingModule } from './create-contrat-routing.module';

import { CreateContratPage } from './create-contrat.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateContratPageRoutingModule,
    NgbModule,
  ],
  declarations: [CreateContratPage],
})
export class CreateContratPageModule {}
