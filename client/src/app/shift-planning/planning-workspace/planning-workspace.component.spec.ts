import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningWorkspaceComponent } from './planning-workspace.component';
import { CommonModule } from '@angular/common';
import { MainTableModule } from '../planning-table/main-table.module';
import { EmployeeInfoTableModule } from '../employee-info-table/employee-info-table.module';

describe('PlanningWorkspaceComponent', () => {
  let component: PlanningWorkspaceComponent;
  let fixture: ComponentFixture<PlanningWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningWorkspaceComponent], 
      imports: [CommonModule,
        MainTableModule,
        EmployeeInfoTableModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlanningWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
