import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickResourcePage } from './pick-resource.page';

describe('PickResourcePage', () => {
  let component: PickResourcePage;
  let fixture: ComponentFixture<PickResourcePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickResourcePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickResourcePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
