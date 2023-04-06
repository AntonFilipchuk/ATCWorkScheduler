import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { interval } from 'rxjs';
import { ITableRow } from './planning-table.component';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { ITimeRow } from '../models/ITimeRow';

/**
 *  _____________________
 *  |time| S1| S2| S3| S4|
 *  ⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
 *  |  1 | e1| e2| e3| e4| -> ITableRow
 *  ⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
 *  |  2 | e1| e2| e3| e4|
 *  ⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻
 *       
 *       | e1| e2| e3| e4| -> ISectorsRow 
 */

let e1: IEmployee = {
  id: 1,
  name: 'Anton',
  totalTime: 0
}

let e2: IEmployee = {
  id: 2,
  name: 'John',
  totalTime: 0
}

let e3: IEmployee = {
  id: 3,
  name: 'Mary',
  totalTime: 0
}

let e4: IEmployee = {
  id: 4,
  name: 'Jane',
  totalTime: 0
}


let defaultEmployee: IEmployee =
{
  id: 1,
  name: "Anton",
  totalTime: 0,
}

@Injectable({
  providedIn: 'root'
})
export class PlanningTableService {

  constructor() {
    this.buildDefaultTable();
  }

  //Employees table
  private _employeesTable: ITableRow[] = [];

  get employeesTable(): ITableRow[] {
    return this._employeesTable;
  }

  set employeesTable(newTable: ITableRow[]) {
    this._employeesTable = newTable;
  }

  //Time table
  private _timeTable: ITimeRow[] = [];

  get timeTable(): ITimeRow[] {
    return this._timeTable;
  }

  set timeTable(newTable: ITimeRow[]) {
    this._timeTable = newTable;
  }

  //
  private _onlySectorColumns: IEmployeesRow[] = [];

  get onlySectorColumns(): IEmployeesRow[] {

    return this._onlySectorColumns;
  }


  getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  getTimeIntervals(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  getSectors(): string[] {
    return ['G12R', 'G12P'];
  }

  buildDefaultTable() {
    let sectors: string[] = this.getSectors();
    let timeIntervals: number[] = this.getTimeIntervals();
    timeIntervals.forEach(time => {
      this._timeTable.push(
        {
          time: time,
        }
      );

      let employeesRow: IEmployeesRow = {};
      sectors.forEach(sector => {
        employeesRow[sector] = defaultEmployee;
      });

      this._employeesTable.push(employeesRow);
    });
  }
  buildDefaultEmployeesTable() {
    let sectors: string[] = this.getSectors();
    let timeIntervals: number[] = this.getTimeIntervals();

    timeIntervals.forEach(interval => {
      let sectorsRow: IEmployeesRow = {};
      sectors.forEach(sector => {
        sectorsRow[sector] = defaultEmployee;
      });
      this._onlySectorColumns.push(sectorsRow);
      this._employeesTable.push(
        {
          Time: interval,
          ...sectorsRow
        }
      );
    });
  }

  setEmployee(employee: IEmployee, rowNumber: number, employeeNumber: number) {
    let employeeToSet: IEmployee = this._onlySectorColumns[rowNumber][employeeNumber];

  }
}
