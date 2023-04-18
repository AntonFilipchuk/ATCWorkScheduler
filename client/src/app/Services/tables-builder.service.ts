import { Injectable, OnInit } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { Observable, ReplaySubject, interval, timeInterval } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { TimeConfigurator } from '../Helpers/TimeConfigurator';
import { ITableRow } from '../models/ITableRow';
import { DefaultTableBuilder } from '../Helpers/DefaultTableBuilder';
import { ISector } from '../models/ISector';


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

let g12r: ISector = { name: 'G12R' }
let g12p: ISector = { name: 'G12P' }
let t1R: ISector = { name: 'T1R' }
let t1P: ISector = { name: 'T1P' }
let sectors: ISector[] = [g12r, g12p]

let e1: IEmployee = {
  id: 1,
  name: 'Anton',
  totalTime: 0,
  sectorPermits: [g12r,],
  color: 'red'
}

let e2: IEmployee = {
  id: 2,
  name: 'John',
  totalTime: 0,
  sectorPermits: [g12r,],
  color: 'green'
}

let e3: IEmployee = {
  id: 3,
  name: 'Mary',
  totalTime: 0,
  sectorPermits: [g12r, g12p],
  color: 'yellow'
}

let e4: IEmployee = {
  id: 4,
  name: 'Jane',
  totalTime: 0,
  sectorPermits: [g12r, g12p, t1R, t1P],
  color: 'blue'
}

let employees: IEmployee[] = [e1, e2, e3, e4,];

let todayDate: Date = new Date();
let shiftStartTime: Date = new Date(todayDate.getDate(), todayDate.getMonth(), todayDate.getDate(), 8, 10);
let shiftEndTime: Date = new Date(todayDate.getDate(), todayDate.getMonth(), todayDate.getDate(), 14, 40);

@Injectable({
  providedIn: 'root'
})


//This service is for validating input,
//building initial table
//and performing actions with this table
//The input:
//1)Sectors - validate there are no duplicates
//2)Employees - validate there are enough employees for the shift,
//every employee can work at least at one sector, 
//there are no duplicate employees
//3)Time - get the start end the end of the shift, also the time interval in minutes
//for building a table
//We will delegate validating input and building initial default tables to the external class 
//DefaultTableBuilder.ts
//What we need: 
//1)A table for the Mat table to render
//2)A table of employees as 2D Array - it's easier to perform actions in this way
//3)A function that rebuild the table for the Mat table when we change the Employees table
//4)A function that takes an employee, the position in the table and decides if and employee 
//can be set there. 

export class TablesBuilderService implements OnInit {

  public $table = new ReplaySubject<ITableRow[]>();
  public displayColumns: string[] = [];

  public employeesForShift: IEmployee[] = [];
  public sectorsForShift: ISector[] = [];

  private _employeesTableAs2DArray: IEmployeesRow[] = [];
  private _tableForMatTable: ITableRow[] = [];
  private _timeColumnAsStringArray: string[] = [];
  private _timeColumnAsDateArray: Date[] = [];

  constructor() {
    this.buildDefaultTable(sectors, employees, shiftStartTime, shiftEndTime, new Date(), 10);
  }
  ngOnInit(): void {
    this.buildTable();
  }


  buildDefaultTable(sectors: ISector[], employees: IEmployee[], shiftStartTime: Date, shiftEndTime: Date, shiftDate: Date, timeIntervalInMinutes: number) {
    let defaultTableBuilder = new DefaultTableBuilder(sectors, employees, shiftStartTime, shiftEndTime, shiftDate, timeIntervalInMinutes);
    this._employeesTableAs2DArray = defaultTableBuilder.tableForEmployeesAs2DArray;
    this._tableForMatTable = defaultTableBuilder.defaultTableForMatTable;
    this._timeColumnAsDateArray = defaultTableBuilder.timeColumnAsDateArray;
    this._timeColumnAsStringArray = defaultTableBuilder.timeColumnAsStringArray;

    this.displayColumns = defaultTableBuilder.displayedColumns;
    this.employeesForShift = defaultTableBuilder.employeesForShift;
    this.sectorsForShift = defaultTableBuilder.sectorsForShift;
  }

  getEmployees() {
    return employees;
  }

  //Call this method every time we change _employeesTableAs2DArray
  private buildTable() {
    let table: ITableRow[] = [];

    for (let i = 0; i < this._timeColumnAsStringArray.length; i++) {
      let sectorsRow: IEmployeesRow = {};
      for (let j = 0; j < this.sectorsForShift.length; j++) {
        sectorsRow[this.sectorsForShift[j].name] = this._employeesTableAs2DArray[i][j];
      };
      table.push(
        {
          time: this._timeColumnAsStringArray[i],
          ...sectorsRow
        }
      );
      this.$table.next(table);
    }
  }


  getTableForSubscription(): Observable<ITableRow[]> {
    this.$table.next(this._tableForMatTable);
    return this.$table;
  }


  public setEmployee(employee: IEmployee, rowNumber: number, sectorName: string) {

    //{ G12R: undefined, G12P: undefined }
    let rowToChange: IEmployeesRow = this._employeesTableAs2DArray[rowNumber];

    if (rowToChange[sectorName] !== employee) {
      rowToChange[sectorName] = employee;
    }
    else {
      console.log("Error adding employee");
    }

    // this._employees[rowNumber] = rowToChange;
    this.buildTable();
  }

}
