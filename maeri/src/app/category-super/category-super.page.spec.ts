import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySuperPage } from './category-super.page';

describe('CategorySuperPage', () => {
  let component: CategorySuperPage;
  let fixture: ComponentFixture<CategorySuperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySuperPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySuperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
