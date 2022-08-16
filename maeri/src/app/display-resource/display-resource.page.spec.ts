import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResourcePage } from './display-resource.page';

describe('DisplayResourcePage', () => {
  let component: DisplayResourcePage;
  let fixture: ComponentFixture<DisplayResourcePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResourcePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResourcePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
