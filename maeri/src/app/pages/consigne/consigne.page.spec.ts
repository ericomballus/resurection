import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsignePage } from './consigne.page';

describe('ConsignePage', () => {
  let component: ConsignePage;
  let fixture: ComponentFixture<ConsignePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsignePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
