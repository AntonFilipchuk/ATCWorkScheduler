import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { Observable, ReplaySubject, interval } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { TimeConfigurator } from '../Helpers/TimeConfigurator';
import { ITableRow } from '../models/ITableRow';


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
  id: -1,
  name: "No",
  totalTime: 0,
}

@Injectable({
  providedIn: 'root'
})


export class TablesBuilderService {


  public $table = new ReplaySubject<ITableRow[]>();

  constructor() {
    this.buildEmployeesTableAs2DArray();
    this.buildTable();
  }

  public getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  public getTimeIntervals(): any[] {
    let timeConfigurator : TimeConfigurator = new TimeConfigurator(22, 40, 1, 10, new Date(), 10);
    return timeConfigurator.time;
  }

  public getSectors(): string[] {
    return ['G12R', 'G12P',];
  }


  //Full table
  private _table: ITableRow[] = [];

  get table(): ITableRow[] {
    return this._table;
  }

  set table(newTable: ITableRow[]) {
    this._table = newTable;
  }

  private _employees: IEmployee[][] = [];

  //

  public buildEmployeesTableAs2DArray() {
    let sectors: string[] = this.getSectors();
    let timeIntervals: any[] = this.getTimeIntervals();

    timeIntervals.forEach(interval => {
      let employeesRow: IEmployee[] = [];
      sectors.forEach(sector => {
        employeesRow.push(defaultEmployee);
      });
      this._employees.push(employeesRow);
    });
  };

  public buildTable() {

    let timeIntervals: any[] = this.getTimeIntervals();
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

    this.$table.next(table);
  }

  getTableForSubscription(): Observable<ITableRow[]> {
    return this.$table;
  }


  public setEmployee(employee: IEmployee, rowNumber: number, sectorNumber: number) {

    let rowToChange = this._employees[rowNumber];

    if (rowToChange.filter(e => JSON.stringify(e) == JSON.stringify(employee)).length < 1) {
      rowToChange[sectorNumber] = employee;
    }
    else {
      console.log("Error adding employee");
    }

    this._employees[rowNumber] = rowToChange;
    this.buildTable();
  }

}
