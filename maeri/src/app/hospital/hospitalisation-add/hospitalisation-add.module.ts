import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HospitalisationAddPageRoutingModule } from './hospitalisation-add-routing.module';

import { HospitalisationAddPage } from './hospitalisation-add.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HospitalisationAddPageRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
  ],
  declarations: [HospitalisationAddPage],
})
export class HospitalisationAddPageModule {}
