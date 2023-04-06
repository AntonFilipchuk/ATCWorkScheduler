import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { PlanningTableService } from './planning-table.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { ITimeRow } from '../models/ITimeRow';



let defaultEmployee: IEmployee = { id: undefined, name: undefined, totalTime: undefined }


export interface ITableRow {
  [key: string]: any;
}


@Component({
  selector: 'app-planning-table',
  styleUrls: ['./planning-table.component.scss'],
  templateUrl: './planning-table.component.html',
})
export class PlanningTableComponent implements OnInit {

  time: number[] = [];
  sectors: string[] = [];
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];

  employeesTableDataSource: MatTableDataSource<IEmployeesRow> = new MatTableDataSource<ITableRow>();
  timeTableDataSource: MatTableDataSource<ITimeRow> = new MatTableDataSource<ITimeRow>();
  employeesColumns: string[] = [];
  timeColumn: string[] = ['Time'];


  constructor(private planningTableService: PlanningTableService) {
  }

  ngOnInit(): void {

    this.time = this.planningTableService.getTimeIntervals();
    this.sectors = this.planningTableService.getSectors();


    this.employeesColumns = [...this.sectors];
    this.sectorNames = [...this.sectors];

    this.employeesTableDataSource.data = this.planningTableService.employeesTable;
    this.timeTableDataSource.data = this.planningTableService.timeTable;


  }

}