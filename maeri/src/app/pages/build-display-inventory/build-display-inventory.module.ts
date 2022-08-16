import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuildDisplayInventoryPageRoutingModule } from './build-display-inventory-routing.module';

import { BuildDisplayInventoryPage } from './build-display-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuildDisplayInventoryPageRoutingModule
  ],
  declarations: [BuildDisplayInventoryPage]
})
export class BuildDisplayInventoryPageModule {}
