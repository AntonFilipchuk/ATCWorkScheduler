import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { PlanningTableService } from './planning-table.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';



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
  dataSource: MatTableDataSource<ITableRow> = new MatTableDataSource<ITableRow>();
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];



  constructor(private planningTableService: PlanningTableService) {
  }

  ngOnInit(): void {

    this.time = this.planningTableService.getTimeIntervals();
    this.sectors = this.planningTableService.getSectors();

    this.displayedColumns = ['Time', ...this.sectors];
    this.sectorNames = [...this.sectors];
    this.dataSource.data = this.planningTableService.table;
    let a = this.planningTableService.table;
    console.log(a, 'Table');

  }


  setAndCheckEmployee(rowNumber: number, columnNumber: number) {
    let employee: IEmployee = {
      id: 1,
      name: 'Anton',
      totalTime: 0
    }
    let employees = this.dataSource.data.map(({ time, ...employees }) => employees);
    let employeeToChange: IEmployee | undefined = employees[rowNumber][columnNumber];

    if (Object.values(employees).includes(employee)) {
      console.log("Cannot set employee to the same time!");
      return;
    }

    this.dataSource.data[rowNumber][columnNumber] = employee;
    console.log(this.dataSource.data[rowNumber][columnNumber]);
    console.log(this.dataSource.data);
  }

}