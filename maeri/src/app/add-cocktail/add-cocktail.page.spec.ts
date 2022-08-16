import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCocktailPage } from './add-cocktail.page';

describe('AddCocktailPage', () => {
  let component: AddCocktailPage;
  let fixture: ComponentFixture<AddCocktailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCocktailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCocktailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
