import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeRetailerProductAddPage } from './employee-retailer-product-add.page';

describe('EmployeeRetailerProductAddPage', () => {
  let component: EmployeeRetailerProductAddPage;
  let fixture: ComponentFixture<EmployeeRetailerProductAddPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRetailerProductAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRetailerProductAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
