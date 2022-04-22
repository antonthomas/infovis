import { TestBed } from '@angular/core/testing';

import { DataExampleService } from './data-example.service';

describe('DataExampleService', () => {
  let service: DataExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
