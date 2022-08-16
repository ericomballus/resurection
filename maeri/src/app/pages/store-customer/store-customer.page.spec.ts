import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreCustomerPage } from './store-customer.page';

describe('StoreCustomerPage', () => {
  let component: StoreCustomerPage;
  let fixture: ComponentFixture<StoreCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
