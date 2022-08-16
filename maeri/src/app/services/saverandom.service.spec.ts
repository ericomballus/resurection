import { TestBed } from '@angular/core/testing';

import { SaverandomService } from './saverandom.service';

describe('SaverandomService', () => {
  let service: SaverandomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaverandomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
