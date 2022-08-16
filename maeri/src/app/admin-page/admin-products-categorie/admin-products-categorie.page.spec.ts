import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsCategoriePage } from './admin-products-categorie.page';

describe('AdminProductsCategoriePage', () => {
  let component: AdminProductsCategoriePage;
  let fixture: ComponentFixture<AdminProductsCategoriePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsCategoriePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsCategoriePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
