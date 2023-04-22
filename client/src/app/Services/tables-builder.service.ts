import { Injectable, OnInit } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { Observable, ReplaySubject, interval, timeInterval, withLatestFrom } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { TimeConfigurator } from '../Helpers/TimeConfigurator';
import { ITableRow } from '../models/ITableRow';
import { DefaultTableBuilder } from '../Helpers/DefaultTableBuilder';
import { ISector } from '../models/ISector';
import { ObjectsComparisonHelper } from '../Helpers/ObjectsComparisonHelper';
import { IWorkAndRestTimeInfo } from '../models/ITimeOfWorkInfo';
import { StickyDirection } from '@angular/cdk/table';


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
let shiftEndTime: Date = new Date(todayDate.getDate(), todayDate.getMonth(), todayDate.getDate(), 9, 0);

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
    this.buildDefaultTable(sectors, employees, shiftStartTime, shiftEndTime, new Date(), 25);
    this._objComparisonHelper = new ObjectsComparisonHelper;
  }
  ngOnInit(): void {
    this.buildTable();
  }


  buildDefaultTable(
    sectors: ISector[],
    employees: IEmployee[],
    shiftStartTime: Date,
    shiftEndTime: Date,
    shiftDate: Date,
    timeIntervalInMinutes: number) {
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

  public getEmployeesForSelection(rowNumber: number, sector: ISector): IEmployee[] {
    let validEmployeesForSelection: IEmployee[] = [];

    for (let i = 0; i < this.employeesForShift.length; i++) {
      const employee: IEmployee = this.employeesForShift[i];

      if (!employee) {
        continue;
      }
      //Check if an employee has a permit for sector
      const employeeSectorPermits: ISector[] = employee.sectorPermits;
      const ifEmployeeHasPermitForSector = this._objComparisonHelper.ifArrayHasAnObject(employeeSectorPermits, sector);
      if (!ifEmployeeHasPermitForSector) {
        continue;
      }

      let ifEmployeeCanBeAddedForSelection = this.ifEmployeeCanBeAddedForSelection(
        employee,
        rowNumber,
        this._employeesTableAs2DArray,
        60,
        120,
        10,
        20,
        this._timeIntervalInMinutes);

      if (ifEmployeeCanBeAddedForSelection) {
        validEmployeesForSelection.push(employee);
      }
      else {
        continue;
      }
    }
    return validEmployeesForSelection;
  }

  private ifEmployeeCanBeAddedForSelection(
    employee: IEmployee,
    rowNumber: number,
    employeesTableAs2DArray: (IEmployee | undefined)[][],
    firstMaxWorkTime: number | undefined,
    secondMaxWorkTime: number,
    firstMinRestTimeInMinutes: number | undefined,
    secondMinRestTimeInMinutes: number,
    timeIntervalInMinutes: number): boolean {

    if (this.ifEmployeeAlreadyWorks(employee, rowNumber, employeesTableAs2DArray)) {
      return false;
    }

    let employeesTableAs2DArrayLength: number = employeesTableAs2DArray.length - 1;
    let previousRow = rowNumber - 1;
    let nextRow = rowNumber + 1;
    //Check if trying to set an employee in the middle
    // length = 6
    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [undefined, undefined] <-- trying to set e1 here
    //4 [e1, e2]
    //5 [e1, e2] 
    //Check if we do not exceed the boundaries of employeesAs2DArray
    //Then check if the next and the previous rows have the same employee 
    if ((previousRow >= 0 && nextRow <= employeesTableAs2DArrayLength) &&
      (this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)
        && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[previousRow], employee))) {
      let previousWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, previousRow);
      let nextWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, nextRow);

      //Check if the sum of workTime t1 + t2 and if 
      //0 [e1, e2] -\
      //1 [e1, e2] ---> t1
      //2 [e1, e2] -/
      //3 [undefined, undefined] <-- trying to set e1 here
      //4 [e1, e2] -\ _> t2
      //5 [e1, e2] -/ 
      let sumOfPreviousAndFutureWorkTime: number =
        previousWorkTimeInfo.currentWorkTimeInMinutes + nextWorkTimeInfo.currentWorkTimeInMinutes;

      return this.ifEmployeeHadRestAndCanWork(
        sumOfPreviousAndFutureWorkTime,
        previousWorkTimeInfo.lastRestTimeInMinutes,
        firstMaxWorkTime,
        secondMaxWorkTime,
        firstMinRestTimeInMinutes,
        secondMinRestTimeInMinutes,
        timeIntervalInMinutes);
    }

    //If we are trying to add employee before
    //0 [undefined, undefined] <-- trying to set e1 here
    //1 [e1, e2]
    //2 [e1, e2] 
    if ((rowNumber + 1 <= employeesTableAs2DArrayLength) && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)) {
      let nextWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, nextRow);
      let previousWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, rowNumber);
      return this.ifEmployeeHadRestAndCanWork(
        nextWorkTimeInfo.currentWorkTimeInMinutes,
        previousWorkTimeInfo.lastRestTimeInMinutes,
        firstMaxWorkTime,
        secondMaxWorkTime,
        firstMinRestTimeInMinutes,
        secondMinRestTimeInMinutes,
        timeIntervalInMinutes);
    }

    //If we are not trying to set employee after    
    //0 [e1, e2] 
    //1 [e1, e2]
    //2 [undefined, undefined] <-- trying to set e1 here
    const workAndRestTime: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, rowNumber);
    const currentWorkTime: number = workAndRestTime.currentWorkTimeInMinutes;
    const lastRestTime: number = workAndRestTime.lastRestTimeInMinutes;

    return this.ifEmployeeHadRestAndCanWork(
      currentWorkTime,
      lastRestTime,
      firstMaxWorkTime,
      secondMaxWorkTime,
      firstMinRestTimeInMinutes,
      secondMinRestTimeInMinutes,
      timeIntervalInMinutes);
  }

  private ifEmployeeAlreadyWorks(employee: IEmployee, rowNumber: number, employeesAs2DArray: (IEmployee | undefined)[][]) {
    let ifRowAlreadyHasEmployee = this._objComparisonHelper.ifArrayHasAnObject(employeesAs2DArray[rowNumber], employee);
    return ifRowAlreadyHasEmployee;
  }

  private ifEmployeeHadRestAndCanWork(
    currentWorkTime: number,
    lastRestTime: number,
    firstMaxWorkTime: number | undefined,
    secondMaxWorkTime: number,
    firstMinRestTimeInMinutes: number | undefined,
    secondMinRestTimeInMinutes: number,
    timeIntervalInMinutes: number): boolean {

    if ((firstMinRestTimeInMinutes && firstMaxWorkTime) &&
      ((currentWorkTime + timeIntervalInMinutes < firstMaxWorkTime) && lastRestTime >= firstMinRestTimeInMinutes)) {
      return true;
    }
    if ((currentWorkTime + timeIntervalInMinutes < secondMaxWorkTime) && lastRestTime >= secondMinRestTimeInMinutes) {
      return true;
    }
    return false;
  }

  public getWorkAndRestTimeInfo(employee: IEmployee, rowNumber: number): IWorkAndRestTimeInfo {

    let currentWorkTime: number = 0;

    let totalWorkTime: number = 0;
    let lastWorkTime: number = 0;

    let totalRestTime: number = 0;
    let lastRestTime: number = 0;

    //Total Work and Rest Time
    [totalWorkTime, totalRestTime] = this.calculateTotalWorkAndRestTime(employee);

    //Last Work and Rest Time
    [lastWorkTime, lastRestTime] = this.calculateLastWorkAndRestTime(employee, rowNumber);

    //CurrentWorkTime
    currentWorkTime = this.calculateCurrentWorkTime(employee, rowNumber);

    let workAndRestInfo: IWorkAndRestTimeInfo =
    {
      lastRestTimeInMinutes: lastRestTime,
      lastWorkTimeInMinutes: lastWorkTime,
      totalRestTimeInMinutes: totalRestTime,
      totalWorkingTimeInMinutes: totalWorkTime,
      currentWorkTimeInMinutes: currentWorkTime
    }
    return workAndRestInfo;
  }

  private calculateTotalWorkAndRestTime(employee: IEmployee): [number, number] {
    let totalWorkTime: number = 0;
    let totalRestTime: number = 0;

    this._employeesTableAs2DArray.forEach(employeesRow => {
      if (this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
        totalWorkTime += this._timeIntervalInMinutes;
      }
      else {
        totalRestTime += this._timeIntervalInMinutes;
      }
    });

    return [totalWorkTime, totalRestTime];
  }

  private calculateCurrentWorkTime(employee: IEmployee, rowNumber: number): number {
    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] <-- start here
    //4 [e1, e2]
    //5 [e3, e2] 
    let currentWorkTime: number = 0;
    let rowWithLastTimeOfWork = rowNumber;

    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] 
    //5 [e3, e2] <-- end here
    while (rowWithLastTimeOfWork < this._employeesTableAs2DArray.length
      && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
      rowWithLastTimeOfWork += 1;
    }

    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] <-- back here
    //5 [e3, e2] 
    rowWithLastTimeOfWork -= 1;

    //0 [e1, e2] <-- end here
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] <--start here
    //5 [e3, e2] 
    while (rowWithLastTimeOfWork >= 0 && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
      currentWorkTime += this._timeIntervalInMinutes;
      rowWithLastTimeOfWork -= 1;
    }

    return currentWorkTime;
  }

  private ifFirstWorkSession(employee: IEmployee, rowNumber: number): boolean {
    
    //Edge case
    //It is *always* first work session
    //If rowNumber is 0
    if (rowNumber === 0) {
      return true;
    }

    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] <-- start here
    //4 [e1, e2]
    //5 [e3, e2] 

    let rowWithLastTimeOfWork = rowNumber;

    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] 
    //5 [e3, e2] <-- end here
    while (rowWithLastTimeOfWork < this._employeesTableAs2DArray.length
      && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
      rowWithLastTimeOfWork += 1;
    }

    //0 [e1, e2]
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] <-- back here
    //5 [e3, e2] 
    rowWithLastTimeOfWork -= 1

    //0 [e1, e2] <-- end here
    //1 [e1, e2] 
    //2 [e1, e2]
    //3 [e1, e2] 
    //4 [e1, e2] <--start here
    //5 [e3, e2] 
    while (rowWithLastTimeOfWork >= 0 && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
      if (rowWithLastTimeOfWork === 0) {
        return true;
      }
      rowWithLastTimeOfWork -= 1;
    }
    return false;
  }

  private calculateLastWorkAndRestTime(employee: IEmployee, rowNumber: number): [number, number] {


    let lastWorkTime: number = 0;
    let lastRestTime: number = 0;
    //Last Work time
    //If an employee worked on previous time period
    //Decrement row to find when was the last rest time period
    //[e1, e2] 
    //[e3, e2] <-- end here (for e1)
    //[e1, e2]
    //[e1, e2]
    //[e1, e2] <-- start here
    let row: number = rowNumber - 1;
    if (row >= 0 && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[row], employee)) {
      while (this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[row], employee) && row > 0) {
        row = row - 1;
      }
    }

    //Than skip all the rest time periods
    //But for the each rest time period add rest time
    //[e1, e2] <-- end here
    //[e3, e2] 
    //[e3, e2]
    //[e3, e2] <-- start here
    //[e1, e2]
    while (row >= 0 && !this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[row], employee)) {
      lastRestTime += this._timeIntervalInMinutes;
      row = row - 1;
    }

    //Now count the previous time work
    //[e1, e2] <-- end here
    //[e1, e2] 
    //[e1, e2]
    //[e1, e2] 
    //[e1, e2] <-- start here
    while (row >= 0 && this._objComparisonHelper.ifArrayHasAnObject(this._employeesTableAs2DArray[row], employee)) {
      lastWorkTime += this._timeIntervalInMinutes;
      row = row - 1;
    }

    //Check if it's first work session
    if (this.ifFirstWorkSession(employee, rowNumber)) {
      lastRestTime = 20;
    }
    return [lastWorkTime, lastRestTime];
  }

  public getEmployeeByRowAnColumnNumber(rowNumber: number, columnNumber: number): IEmployee | undefined {
    return this._employeesTableAs2DArray[rowNumber][columnNumber];
  }


  private minutesToMilliseconds(minutes: number): number {
    return minutes * 60000;
  }
}
