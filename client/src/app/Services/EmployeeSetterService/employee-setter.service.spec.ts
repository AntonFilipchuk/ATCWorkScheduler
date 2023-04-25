import { TestBed } from '@angular/core/testing';

import { EmployeeSetterService } from './employee-setter.service';

describe('EmployeeSetterService', () => {
  let service: EmployeeSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
