import { TestBed } from '@angular/core/testing';

import { ChildBillService } from './child-bill.service';

describe('ChildBillService', () => {
  let service: ChildBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
