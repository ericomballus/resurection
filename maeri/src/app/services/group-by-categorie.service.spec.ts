import { TestBed } from '@angular/core/testing';

import { GroupByCategorieService } from './group-by-categorie.service';

describe('GroupByCategorieService', () => {
  let service: GroupByCategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupByCategorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
