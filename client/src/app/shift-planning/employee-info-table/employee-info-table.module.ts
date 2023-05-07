import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeInfoTableComponent } from './employee-info-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [EmployeeInfoTableComponent],
  imports: [
    CommonModule, 
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  exports: [
    EmployeeInfoTableComponent
  ]
})
export class EmployeeInfoTableModule { }
