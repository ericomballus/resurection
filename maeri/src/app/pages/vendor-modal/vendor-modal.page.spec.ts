import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorModalPage } from './vendor-modal.page';

describe('VendorModalPage', () => {
  let component: VendorModalPage;
  let fixture: ComponentFixture<VendorModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
