import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatListPage } from './plat-list.page';

describe('PlatListPage', () => {
  let component: PlatListPage;
  let fixture: ComponentFixture<PlatListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
