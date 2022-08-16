import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorRetailerListPage } from './vendor-retailer-list.page';

describe('VendorRetailerListPage', () => {
  let component: VendorRetailerListPage;
  let fixture: ComponentFixture<VendorRetailerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRetailerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRetailerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
