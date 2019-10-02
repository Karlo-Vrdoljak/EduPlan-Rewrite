import { TestBed } from '@angular/core/testing';

import { StudentiService } from './studenti.service';

describe('StudentiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentiService = TestBed.get(StudentiService);
    expect(service).toBeTruthy();
  });
});
