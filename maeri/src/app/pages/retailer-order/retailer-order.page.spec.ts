import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetailerOrderPage } from './retailer-order.page';

describe('RetailerOrderPage', () => {
  let component: RetailerOrderPage;
  let fixture: ComponentFixture<RetailerOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetailerOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
