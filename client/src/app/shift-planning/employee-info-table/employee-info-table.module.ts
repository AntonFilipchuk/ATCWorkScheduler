import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeInfoTableComponent } from './employee-info-table.component';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [EmployeeInfoTableComponent],
  imports: [
    CommonModule, 
    MatTableModule
  ],
  exports: [
    EmployeeInfoTableComponent
  ]
})
export class EmployeeInfoTableModule { }
