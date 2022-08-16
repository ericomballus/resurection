import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorOrdersPage } from './vendor-orders.page';

describe('VendorOrdersPage', () => {
  let component: VendorOrdersPage;
  let fixture: ComponentFixture<VendorOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
