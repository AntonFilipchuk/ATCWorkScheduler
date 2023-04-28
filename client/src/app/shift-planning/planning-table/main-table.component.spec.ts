import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTableComponent } from './main-table.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let fixture: ComponentFixture<MainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTableComponent ],
      imports: [
        CommonModule,
        MatTableModule,
        MatSelectModule,
        MatFormFieldModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
