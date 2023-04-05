import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { interval } from 'rxjs';

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

export interface ITableRow {
  [key: string]: any;
}

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

let rowExample: ITableRow = {
  time: 1,
  s1: e1,
  s2: e2,
  s3: e3,
  s4: e4
}

let defaultEmployee: IEmployee =
{
  id: 1,
  name: "Anton",
  totalTime: 0,
}

export interface ISectorsRow {
  [sectorName: string]: IEmployee
}

@Injectable({
  providedIn: 'root'
})
export class PlanningTableService {

  constructor() {
    this.buildDefaultEmployeesTable()
  }

  private _table: ITableRow[] = [];

  get table(): ITableRow[] {
    return this._table;
  }

  set table(newTable: ITableRow[]) {
    this._table = newTable;
  }

  private _onlySectorColumns: ISectorsRow[] = [];

  get onlySectorColumns(): ISectorsRow[] {
    return this._onlySectorColumns;
  }


  getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  getTimeIntervals(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  getSectors(): string[] {
    return ['G12R', 'G12P', 'G345R'];
  }

  buildDefaultEmployeesTable() {
    let sectors: string[] = this.getSectors();
    let timeIntervals: number[] = this.getTimeIntervals();

    timeIntervals.forEach(interval => {
      let sectorsRow: ISectorsRow = {};
      sectors.forEach(sector => {
        sectorsRow[sector] = defaultEmployee;
      });
      this._onlySectorColumns.push(sectorsRow);
      this._table.push(
        {
          Time: interval,
          ...sectorsRow
        }
      );
    });

  }
}
