import { TestBed } from '@angular/core/testing';

import { CreatepackService } from './createpack.service';

describe('CreatepackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatepackService = TestBed.get(CreatepackService);
    expect(service).toBeTruthy();
  });
});
