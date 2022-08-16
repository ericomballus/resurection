import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperManagerPageRoutingModule } from './super-manager-routing.module';

import { SuperManagerPage } from './super-manager.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from '../share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperManagerPageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [SuperManagerPage],
})
export class SuperManagerPageModule {}
