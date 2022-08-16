import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorShopPage } from './vendor-shop.page';

describe('VendorShopPage', () => {
  let component: VendorShopPage;
  let fixture: ComponentFixture<VendorShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
