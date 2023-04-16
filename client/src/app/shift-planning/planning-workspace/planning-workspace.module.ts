import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningWorkspaceComponent } from './planning-workspace.component';
import { MainTableModule } from '../planning-table/main-table.module';
import { EmployeeInfoTableModule } from '../employee-info-table/employee-info-table.module';



@NgModule({
  declarations: [PlanningWorkspaceComponent],
  imports: [
    CommonModule,
    MainTableModule,
    EmployeeInfoTableModule
  ],
  exports: [
    PlanningWorkspaceComponent
  ]
})
export class PlanningWorkspaceModule { }
