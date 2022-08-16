import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickProductPage } from './pick-product.page';

describe('PickProductPage', () => {
  let component: PickProductPage;
  let fixture: ComponentFixture<PickProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
