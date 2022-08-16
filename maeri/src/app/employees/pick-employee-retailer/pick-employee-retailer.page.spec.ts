import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickEmployeeRetailerPage } from './pick-employee-retailer.page';

describe('PickEmployeeRetailerPage', () => {
  let component: PickEmployeeRetailerPage;
  let fixture: ComponentFixture<PickEmployeeRetailerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PickEmployeeRetailerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickEmployeeRetailerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
