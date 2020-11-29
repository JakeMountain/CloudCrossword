import { TestBed } from '@angular/core/testing';

import { XworodFetchService } from './xworod-fetch.service';

describe('XworodFetchService', () => {
  let service: XworodFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XworodFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
