import { TestBed } from '@angular/core/testing';

import { MadebyService } from './madeby.service';

describe('MadebyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MadebyService = TestBed.get(MadebyService);
    expect(service).toBeTruthy();
  });
});
