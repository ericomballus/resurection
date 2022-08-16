import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventaireListPage } from './inventaire-list.page';

describe('InventaireListPage', () => {
  let component: InventaireListPage;
  let fixture: ComponentFixture<InventaireListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventaireListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventaireListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
