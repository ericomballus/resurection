import { TestBed } from '@angular/core/testing';

import { CountItemsService } from './count-items.service';

describe('CountItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountItemsService = TestBed.get(CountItemsService);
    expect(service).toBeTruthy();
  });
});
