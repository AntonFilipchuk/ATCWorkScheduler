import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoTableComponent } from './employee-info-table.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

describe('EmployeeInfoTableComponent', () => {
  let component: EmployeeInfoTableComponent;
  let fixture: ComponentFixture<EmployeeInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInfoTableComponent ],
      imports: [
        CommonModule, 
        MatTableModule
      ]
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
