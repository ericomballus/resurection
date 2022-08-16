import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorStartPage } from './vendor-start.page';

describe('VendorStartPage', () => {
  let component: VendorStartPage;
  let fixture: ComponentFixture<VendorStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorStartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
