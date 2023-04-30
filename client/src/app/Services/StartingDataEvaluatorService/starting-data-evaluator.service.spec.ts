import { TestBed } from '@angular/core/testing';

import { StartingDataEvaluatorService } from './starting-data-evaluator.service';

describe('StartingDataEvaluatorService', () => {
  let service: StartingDataEvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartingDataEvaluatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
