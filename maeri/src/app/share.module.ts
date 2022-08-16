import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DisplayitemsComponent } from './components/displayitems/displayitems.component';
import { DisplayinvoicesComponent } from './components/displayinvoices/displayinvoices.component';
import { DisplayordersComponent } from './components/displayorders/displayorders.component';
import { CoursesComponent } from './courses/courses.component';
import { DisplaystockComponent } from './components/displaystock/displaystock.component';
import { RestostockComponent } from './components/restostock/restostock.component';
import { DisplayproductComponent } from './components/displayproduct/displayproduct.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { CacheImageComponent } from './components/cache-image/cache-image.component';
import { PickComponent } from './components/pick/pick.component';
import { FakedataComponent } from './components/fakedata/fakedata.component';
import { RetourProduitsComponent } from './components/retour-produits/retour-produits.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule.forChild()],
  declarations: [
    DisplayitemsComponent,
    DisplayinvoicesComponent,
    DisplayordersComponent,
    CoursesComponent,
    DisplaystockComponent,
    RestostockComponent,
    DisplayproductComponent,
    ResourcesComponent,
    CacheImageComponent,
    PickComponent,
    FakedataComponent,
    RetourProduitsComponent,

    // SumModule,
  ],
  exports: [
    DisplayitemsComponent,
    DisplayinvoicesComponent,
    DisplayordersComponent,
    CoursesComponent,
    DisplaystockComponent,
    RestostockComponent,
    DisplayproductComponent,
    ResourcesComponent,
    CacheImageComponent,
    PickComponent,
    FakedataComponent,
    RetourProduitsComponent,
    // SumModule,
  ],
})
export class ShareModule {}
