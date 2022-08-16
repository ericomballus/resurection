import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WharehousePage } from './wharehouse.page';

describe('WharehousePage', () => {
  let component: WharehousePage;
  let fixture: ComponentFixture<WharehousePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WharehousePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WharehousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
