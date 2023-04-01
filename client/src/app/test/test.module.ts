import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { MatTableModule } from '@angular/material/table';




@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule, MatTableModule
  ],
  exports: [
    TestComponent
  ]
})
export class TestModule { }
