import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { PlanningTableModule } from './planning-table/planning-table.module';
import { TestModule } from './test/test.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    PlanningTableModule,
    TestModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
