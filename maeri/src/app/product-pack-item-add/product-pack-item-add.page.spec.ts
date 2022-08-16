import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPackItemAddsPage } from './product-pack-Item-adds.page';

describe('ProductPackItemAddsPage', () => {
  let component: ProductPackItemAddsPage;
  let fixture: ComponentFixture<ProductPackItemAddsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPackItemAddsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPackItemAddsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
