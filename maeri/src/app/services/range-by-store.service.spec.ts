import { TestBed } from '@angular/core/testing';

import { RangeByStoreService } from './range-by-store.service';

describe('RangeByStoreService', () => {
  let service: RangeByStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RangeByStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
