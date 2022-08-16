import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserAddOwnProductPage } from './user-add-own-product.page';

describe('UserAddOwnProductPage', () => {
  let component: UserAddOwnProductPage;
  let fixture: ComponentFixture<UserAddOwnProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddOwnProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddOwnProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
