import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiePage } from './activitie.page';

describe('ActivitiePage', () => {
  let component: ActivitiePage;
  let fixture: ComponentFixture<ActivitiePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
