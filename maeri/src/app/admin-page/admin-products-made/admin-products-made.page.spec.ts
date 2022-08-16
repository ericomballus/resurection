import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsMadePage } from './admin-products-made.page';

describe('AdminProductsMadePage', () => {
  let component: AdminProductsMadePage;
  let fixture: ComponentFixture<AdminProductsMadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsMadePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsMadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
