import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillardUpdatePage } from './billard-update.page';

describe('BillardUpdatePage', () => {
  let component: BillardUpdatePage;
  let fixture: ComponentFixture<BillardUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillardUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillardUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
