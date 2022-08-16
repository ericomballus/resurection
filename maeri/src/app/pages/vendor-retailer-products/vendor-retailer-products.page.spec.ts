import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorRetailerProductsPage } from './vendor-retailer-products.page';

describe('VendorRetailerProductsPage', () => {
  let component: VendorRetailerProductsPage;
  let fixture: ComponentFixture<VendorRetailerProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRetailerProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRetailerProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
