import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisplayInventairePage } from './display-inventaire.page';

describe('DisplayInventairePage', () => {
  let component: DisplayInventairePage;
  let fixture: ComponentFixture<DisplayInventairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayInventairePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayInventairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
