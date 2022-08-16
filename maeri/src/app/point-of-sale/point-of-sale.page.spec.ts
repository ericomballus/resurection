import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfSalePage } from './point-of-sale.page';

describe('PointOfSalePage', () => {
  let component: PointOfSalePage;
  let fixture: ComponentFixture<PointOfSalePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointOfSalePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfSalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
