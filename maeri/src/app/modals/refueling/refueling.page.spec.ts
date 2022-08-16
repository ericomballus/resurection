import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefuelingPage } from './refueling.page';

describe('RefuelingPage', () => {
  let component: RefuelingPage;
  let fixture: ComponentFixture<RefuelingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefuelingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefuelingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
