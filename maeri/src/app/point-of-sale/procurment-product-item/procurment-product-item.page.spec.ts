import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurmentProductItemPage } from './procurment-product-item.page';

describe('ProcurmentProductItemPage', () => {
  let component: ProcurmentProductItemPage;
  let fixture: ComponentFixture<ProcurmentProductItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurmentProductItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurmentProductItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
