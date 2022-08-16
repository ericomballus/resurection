import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorCartPage } from './vendor-cart.page';

describe('VendorCartPage', () => {
  let component: VendorCartPage;
  let fixture: ComponentFixture<VendorCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
