import { TestBed } from '@angular/core/testing';

import { TablesBuilderService } from './tables-builder.service';

describe('TablesBuilderService', () => {
  let service: TablesBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablesBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
