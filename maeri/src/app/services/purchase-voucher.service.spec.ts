import { TestBed } from '@angular/core/testing';

import { PurchaseVoucherService } from './purchase-voucher.service';

describe('PurchaseVoucherService', () => {
  let service: PurchaseVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
