import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoslivePage } from './poslive.page';

describe('PoslivePage', () => {
  let component: PoslivePage;
  let fixture: ComponentFixture<PoslivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoslivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoslivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
