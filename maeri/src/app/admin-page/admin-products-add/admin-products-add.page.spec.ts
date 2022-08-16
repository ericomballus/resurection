import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsAddPage } from './admin-products-add.page';

describe('AdminProductsAddPage', () => {
  let component: AdminProductsAddPage;
  let fixture: ComponentFixture<AdminProductsAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
