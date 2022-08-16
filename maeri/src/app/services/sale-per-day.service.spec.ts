import { TestBed } from '@angular/core/testing';

import { SalePerDayService } from './sale-per-day.service';

describe('SalePerDayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalePerDayService = TestBed.get(SalePerDayService);
    expect(service).toBeTruthy();
  });
});
