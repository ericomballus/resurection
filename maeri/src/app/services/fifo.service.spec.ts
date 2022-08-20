import { TestBed } from '@angular/core/testing';

import { FifoService } from './fifo.service';

describe('FifoService', () => {
  let service: FifoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FifoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
