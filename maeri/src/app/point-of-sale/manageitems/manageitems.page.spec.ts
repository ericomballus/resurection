import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageitemsPage } from './manageitems.page';

describe('ManageitemsPage', () => {
  let component: ManageitemsPage;
  let fixture: ComponentFixture<ManageitemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageitemsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageitemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
