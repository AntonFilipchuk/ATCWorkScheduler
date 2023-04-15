import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningWorkspaceComponent } from './planning-workspace.component';
import { MainTableModule } from '../planning-table/main-table.module';



@NgModule({
  declarations: [PlanningWorkspaceComponent],
  imports: [
    CommonModule, 
    MainTableModule
  ],
  exports : [
    PlanningWorkspaceComponent
  ]
})
export class PlanningWorkspaceModule { }
