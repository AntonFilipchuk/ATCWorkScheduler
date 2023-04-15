import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { TestModule } from './test/test.module';
import { PlanningWorkspaceComponent } from './shift-planning/planning-workspace/planning-workspace.component';
import { PlanningWorkspaceModule } from './shift-planning/planning-workspace/planning-workspace.module';
import { EmployeeInfoTableComponent } from './shift-planning/employee-info-table/employee-info-table.component';
import { MainTableModule } from './shift-planning/planning-table/main-table.module';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeInfoTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MainTableModule,
    TestModule,
    PlanningWorkspaceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
