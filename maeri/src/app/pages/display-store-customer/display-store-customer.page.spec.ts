import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisplayStoreCustomerPage } from './display-store-customer.page';

describe('DisplayStoreCustomerPage', () => {
  let component: DisplayStoreCustomerPage;
  let fixture: ComponentFixture<DisplayStoreCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayStoreCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayStoreCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
