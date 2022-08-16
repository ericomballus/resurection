import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisproductPage } from './disproduct.page';

describe('DisproductPage', () => {
  let component: DisproductPage;
  let fixture: ComponentFixture<DisproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
