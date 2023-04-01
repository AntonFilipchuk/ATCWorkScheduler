import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { PlanningTableComponent } from './planning-table.component';
import { SelectableTableElementComponent } from './selectable-table-element/selectable-table-element.component';



@NgModule({
  declarations: [PlanningTableComponent, SelectableTableElementComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports:
    [
      PlanningTableComponent
    ],

})
export class PlanningTableModule { }
