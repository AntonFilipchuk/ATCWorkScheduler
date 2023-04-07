import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { ITableRow } from './planning-table.component';
import { IEmployeesRow } from '../models/IEmployeesRow';


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
  }

  //Full table
  private _table: ITableRow[] = [];

  get table(): ITableRow[] {
    return this._table;
  }

  set table(newTable: ITableRow[]) {
    this._table = newTable;
  }

  //Employees sub table
  private _employeesSubTable: IEmployeesRow[] = [];

  get employeesSubTable(): IEmployeesRow[] {
    let fullTable: ITableRow[] = this.table;
    let employeesSubTable: IEmployeesRow[] = [];
    fullTable.forEach(row => {
      let rowWithoutTime = (({ time, ...restObjects }) => restObjects)(row);
      employeesSubTable.push(rowWithoutTime);
    });
    this._employeesSubTable = employeesSubTable;
    return this._employeesSubTable;
  }


  public getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  public getTimeIntervals(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  public getSectors(): string[] {
    return ['G12R', 'G12P'];
  }

  public foo() {
    let guid = crypto.randomUUID();
    console.log(`Called Foo ${guid}`);

  }

  public buildDefaultTable() {

    console.log("Called");

    let sectors: string[] = this.getSectors();
    let timeIntervals: number[] = this.getTimeIntervals();

    timeIntervals.forEach(interval => {
      let sectorsRow: IEmployeesRow = {};
      sectors.forEach(sector => {
        sectorsRow[sector] = defaultEmployee;
      });
      this._table.push(
        {
          time: interval,
          ...sectorsRow
        }
      );
    });
  }

  public setEmployee(employee: IEmployee, rowNumber: number, sectorName: string) {
    let employeesSubTable = this.employeesSubTable;
    let rowToCheck = employeesSubTable[rowNumber];

    let rowCheckSector = (({ sectorName, ...restObjects }) => restObjects)(rowToCheck);

    console.log(rowCheckSector);
    this._table[rowNumber][sectorName] = employee;
  }

}
