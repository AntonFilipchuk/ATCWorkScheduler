import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MainTableComponent } from './main-table.component';
import { SelectableTableElementComponent } from './selectable-table-element/selectable-table-element.component';




@NgModule({
  declarations: [MainTableComponent, SelectableTableElementComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports:
    [
      MainTableComponent
    ],

})
export class MainTableModule { }
