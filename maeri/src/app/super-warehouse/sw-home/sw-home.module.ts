import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwHomePageRoutingModule } from './sw-home-routing.module';

import { SwHomePage } from './sw-home.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwHomePageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [SwHomePage],
})
export class SwHomePageModule {}
