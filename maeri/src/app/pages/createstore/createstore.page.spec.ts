import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatestorePage } from './createstore.page';

describe('CreatestorePage', () => {
  let component: CreatestorePage;
  let fixture: ComponentFixture<CreatestorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatestorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatestorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
