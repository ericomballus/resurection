import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDisplayCollectionsPageRoutingModule } from './admin-display-collections-routing.module';

import { AdminDisplayCollectionsPage } from './admin-display-collections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDisplayCollectionsPageRoutingModule
  ],
  declarations: [AdminDisplayCollectionsPage]
})
export class AdminDisplayCollectionsPageModule {}
