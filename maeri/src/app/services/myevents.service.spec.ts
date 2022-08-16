import { TestBed } from '@angular/core/testing';

import { MyeventsService } from './myevents.service';

describe('MyeventsService', () => {
  let service: MyeventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyeventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
