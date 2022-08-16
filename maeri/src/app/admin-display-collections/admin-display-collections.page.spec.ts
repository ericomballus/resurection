import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminDisplayCollectionsPage } from './admin-display-collections.page';

describe('AdminDisplayCollectionsPage', () => {
  let component: AdminDisplayCollectionsPage;
  let fixture: ComponentFixture<AdminDisplayCollectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisplayCollectionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDisplayCollectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
