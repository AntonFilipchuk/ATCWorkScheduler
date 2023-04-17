import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MainTableComponent } from './main-table.component';
import { SelectableTableElementComponent } from './selectable-table-element/selectable-table-element.component';
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [MainTableComponent, SelectableTableElementComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  exports:
    [
      MainTableComponent
    ],

})
export class MainTableModule { }
