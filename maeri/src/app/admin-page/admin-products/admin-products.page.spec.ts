import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsPage } from './admin-products.page';

describe('AdminProductsPage', () => {
  let component: AdminProductsPage;
  let fixture: ComponentFixture<AdminProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
