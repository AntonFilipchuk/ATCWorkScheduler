import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { ITableRow } from './planning-table.component';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { Observable, ReplaySubject, interval } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';


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


export class PlanningTableService extends DataSource<ITableRow>   {



  constructor() {
    super();
    this.buildEmployeesTableAs2DArray();
    this.buildTable();
  }

  public getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  public getTimeIntervals(): number[] {
    return [1, 2, 3];
  }

  public getSectors(): string[] {
    return ['G12R', 'G12P'];
  }

  private _tableDataStream = new ReplaySubject<ITableRow[]>();

  //Full table
  private _table: ITableRow[] = [];

  get table(): ITableRow[] {
    return this._table;
  }

  set table(newTable: ITableRow[]) {
    this._table = newTable;
  }

  private _employees: IEmployee[][] = [];


  connect(): Observable<readonly ITableRow[]> {
    return this._tableDataStream;
  }

  setTableData(data: ITableRow[]) {
    this._tableDataStream.next(data);
  }

  disconnect(): void {

  }

  public buildEmployeesTableAs2DArray() {
    let sectors: string[] = this.getSectors();
    let timeIntervals: number[] = this.getTimeIntervals();

    timeIntervals.forEach(interval => {
      let employeesRow: IEmployee[] = [];
      sectors.forEach(sector => {
        employeesRow.push(defaultEmployee);
      });
      this._employees.push(employeesRow);
    });
  };

  public buildTable() {

    let timeIntervals: number[] = this.getTimeIntervals();
    let sectors: string[] = this.getSectors();
    let table: ITableRow[] = [];
    for (let i = 0; i < timeIntervals.length; i++) {
      let sectorsRow: IEmployeesRow = {};
      for (let j = 0; j < sectors.length; j++) {
        sectorsRow[sectors[j]] = this._employees[i][j];
      };
      table.push(
        {
          time: timeIntervals[i],
          ...sectorsRow
        }
      );
    };

    this.setTableData(table);
  }

  getTableForSubscription(): Observable<ITableRow[]> {
    let table = new Observable<ITableRow[]>(observer => observer.next(this._table));
    return table;
  }


  public setEmployee(employee: IEmployee, rowNumber: number, sectorNumber: number) {

    let rowToChange = this._employees[rowNumber];

    let employeeEntriesCount: number = 0;

    for (let i = 0; i < rowToChange.length; i++) {
      if (employee === rowToChange[i]) {
        employeeEntriesCount++;
      }

      if (employeeEntriesCount > 0) {
        console.log("Error adding employee");
        break;
      }

      rowToChange[sectorNumber] = employee;
    }

    this._employees[rowNumber] = rowToChange;
    this.buildTable();
  }

}
