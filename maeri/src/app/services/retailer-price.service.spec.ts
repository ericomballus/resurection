import { TestBed } from '@angular/core/testing';

import { RetailerPriceService } from './retailer-price.service';

describe('RetailerPriceService', () => {
  let service: RetailerPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
