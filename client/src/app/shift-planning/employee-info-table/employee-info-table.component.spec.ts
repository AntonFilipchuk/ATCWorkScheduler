import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoTableComponent } from './employee-info-table.component';

describe('EmployeeInfoTableComponent', () => {
  let component: EmployeeInfoTableComponent;
  let fixture: ComponentFixture<EmployeeInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInfoTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
