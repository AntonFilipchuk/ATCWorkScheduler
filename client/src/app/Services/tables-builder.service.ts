import { Injectable, OnInit } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { Observable, ReplaySubject, interval, timeInterval } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { TimeConfigurator } from '../Helpers/TimeConfigurator';
import { ITableRow } from '../models/ITableRow';
import { DefaultTableBuilder } from '../Helpers/DefaultTableBuilder';
import { ISector } from '../models/ISector';
import { ObjectsComparisonHelper } from '../Helpers/ObjectsComparisonHelper';
import { ITimeOfWorkInfo } from '../models/ITimeOfWorkInfo';


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
  color: 'orange'
}

let employees: IEmployee[] = [e1, e2, e3, e4,];

let todayDate: Date = new Date();
let shiftStartTime: Date = new Date(todayDate.getDate(), todayDate.getMonth(), todayDate.getDate(), 8, 0);
let shiftEndTime: Date = new Date(todayDate.getDate(), todayDate.getMonth(), todayDate.getDate(), 10, 0);

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

  private _employeesTableAs2DArray: (IEmployee | undefined)[][] = [];
  private _tableForMatTable: ITableRow[] = [];
  private _timeColumnAsStringArray: string[] = [];
  private _timeColumnAsDateArray: Date[] = [];
  private _timeIntervalInMinutes: number = 0;

  private _objComparisonHelper: ObjectsComparisonHelper;

  constructor() {
    this.buildDefaultTable(sectors, employees, shiftStartTime, shiftEndTime, new Date(), 10);
    this._objComparisonHelper = new ObjectsComparisonHelper;
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
    this._timeIntervalInMinutes = defaultTableBuilder.timeIntervalInMinutes;
    this.displayColumns = defaultTableBuilder.displayedColumns;
    this.employeesForShift = defaultTableBuilder.employeesForShift;
    this.sectorsForShift = defaultTableBuilder.sectorsForShift;
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


  public getTableForSubscription(): Observable<ITableRow[]> {
    this.$table.next(this._tableForMatTable);
    return this.$table;
  }

  //Check if an employee is not at another sector at the same time
  //Check if an employee had enough rest:
  //If he worked less then one hour 
  //He can be set after 10 mins
  //Else after 20 mins 
  public setEmployeeInRow(employee: IEmployee, rowNumber: number, columnNumber: number) {

    let rowToChange: (IEmployee | undefined)[] = this._employeesTableAs2DArray[rowNumber];
    let employeeToChange: IEmployee | undefined = rowToChange[columnNumber];

    if (this._objComparisonHelper.ifArrayHasAnObject(rowToChange, employee)) {
      console.log(`Can not set ${employee.name} at the same time on different sector!`);
      return;
    }
    if (JSON.stringify(employeeToChange) !== JSON.stringify(employee)) {
      employeeToChange = employee;
      this._employeesTableAs2DArray[rowNumber][columnNumber] = employeeToChange;
      this.buildTable();
    }
    else {
      console.log("Error adding the same employee at the same time");
      return;
    }
  }

  //[e1, e2]
  //[e2, e1]
  //[e1, e2]
  //[e3, e1]
  //[e3, e2]
  private calculateMinutesOfPreviousWorkTime(employee: IEmployee, rowNumber: number, columnNumber: number): ITimeOfWorkInfo {

    let totalMinutesWorked: number = 0;
    let lastWorkingSessionTimeInMinutes: number = 0;
    let currentWorkingSessionTimeInMinutes: number = 0;
    let lastRestTimeInMinutes: number = 0;
    let currentRestTimeInMinutes: number = 0;

    this._employeesTableAs2DArray.forEach(employeesRow => {
      if (this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
        totalMinutesWorked += this._timeIntervalInMinutes;
      }
    });


    let timeOfWorkInfo: ITimeOfWorkInfo = {
      currentRestTimeInMinutes: currentRestTimeInMinutes,
      currentWorkingSessionTimeInMinutes: currentWorkingSessionTimeInMinutes,
      lastRestTimeInMinutes: lastRestTimeInMinutes,
      lastWorkingSessionTimeInMinutes: lastWorkingSessionTimeInMinutes,
      totalMinutesWorked: totalMinutesWorked
    }

    return timeOfWorkInfo;
  }

  public calculateTotalWorkingTime(employee: IEmployee, rowNumber: number, columnNumber: number): number {

    let totalWorkingTime: number = 0;
    this._employeesTableAs2DArray.forEach(employeesRow => {
      if (this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
        totalWorkingTime += this._timeIntervalInMinutes;
      }
    });
    return totalWorkingTime;
  }

  public calculateTimeOfWorkSession(employee: IEmployee, rowNumber: number, columnNumber: number) {

    let workTimeForSession: number = 0;

    if (this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[rowNumber], employee)) {
      workTimeForSession += this._timeIntervalInMinutes;
    }

    for (let i = rowNumber; i > 0; i--) {
      const employeesRow = this._employeesTableAs2DArray[i - 1];
      if (this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
        workTimeForSession += this._timeIntervalInMinutes;
      }
      else {
        return workTimeForSession;
      }
    }
    return workTimeForSession;
  }

  public calculateTotalRestTime(employee: IEmployee): number {
    let totalRestTime: number = 0;

    this._employeesTableAs2DArray.forEach(employeesRow => {
      if (!this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
        totalRestTime += this._timeIntervalInMinutes;
      }
    });

    return totalRestTime;
  }

  public calculateLastRestTime(employee: IEmployee, rowNumber: number, columnNumber: number): number {
    let lastRestTime: number = 0;

    for (let i = rowNumber; i > 0; i--) {
      const previousEmployeesRow = this._employeesTableAs2DArray[i - 1];
      if (!this._objComparisonHelper.ifArrayHasAnObject(previousEmployeesRow, employee)) {
        lastRestTime += this._timeIntervalInMinutes;
      }
      else {
        return lastRestTime;
      }
    }

    return lastRestTime;
  }

  public getEmployeeByRowNumberAndSectorName(rowNumber: number, columnNumber: number): IEmployee | undefined {
    return this._employeesTableAs2DArray[rowNumber][columnNumber];
  }


  private minutesToMilliseconds(minutes: number): number {
    return minutes * 60000;
  }
}
