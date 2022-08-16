import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FcHomePageRoutingModule } from './fc-home-routing.module';

import { FcHomePage } from './fc-home.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FcHomePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [FcHomePage],
})
export class FcHomePageModule {}
