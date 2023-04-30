import { Injectable, OnInit } from '@angular/core';
import { IEmployee } from '../../models/IEmployee';
import { IEmployeesRow } from '../../models/IEmployeesRow';
import {
  Observable,
  ReplaySubject,
  interval,
  timeInterval,
  withLatestFrom,
} from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { TimeConfigurator } from '../../Helpers/TimeConfigurator';
import { ITableRow } from '../../models/ITableRow';
import { DefaultTableBuilder } from '../../Helpers/DefaultTableBuilder';
import { ISector } from '../../models/ISector';
import { ObjectsComparisonHelper } from '../../Helpers/ObjectsComparisonHelper';
import { IWorkAndRestTimeInfo } from '../../models/IWorkAndRestTimeInfo';
import { StickyDirection } from '@angular/cdk/table';
import { EmployeesWhoCanWorkEvaluator } from '../../Helpers/EmployeesWhoCanWorkEvaluator';

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

let g12r: ISector = { name: 'G12R' };
let g12p: ISector = { name: 'G12P' };
let g345r: ISector = { name: 'G345R' };
let g345p: ISector = { name: 'G345P' };
let t1R: ISector = { name: 'T1R' };
let t1P: ISector = { name: 'T1P' };
let sectors: ISector[] = [g12r, g12p, g345r, g345p];

let e1: IEmployee = {
  id: 1,
  name: 'Filipchuk',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'red',
};

let e2: IEmployee = {
  id: 2,
  name: 'Egorov',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'green',
};

let e3: IEmployee = {
  id: 3,
  name: 'Gallyamov',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'yellow',
};

let e4: IEmployee = {
  id: 4,
  name: 'Nosenko',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'orange',
};

let e5: IEmployee = {
  id: 5,
  name: 'Mozjuhin',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'Chocolate',
};

let e6: IEmployee = {
  id: 6,
  name: 'Boiko',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'Aqua',
};

let e7: IEmployee = {
  id: 7,
  name: 'Fomin',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'DarkMagenta ',
};

let e8: IEmployee = {
  id: 8,
  name: 'Ignanin',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'DarkBlue',
};

let e9: IEmployee = {
  id: 9,
  name: 'Chiglyakov',
  totalTime: 0,
  sectorPermits: [g12r, g12p, g345r, g345p],
  color: 'Crimson ',
};

let employees: IEmployee[] = [e1, e2, e3, e4, e5, e6, e7, e8, e9];

let todayDate: Date = new Date();
let shiftStartTime: Date = new Date(
  todayDate.getDate(),
  todayDate.getMonth(),
  todayDate.getDate(),
  8,
  0
);
let shiftEndTime: Date = new Date(
  todayDate.getDate(),
  todayDate.getMonth(),
  todayDate.getDate(),
  15,
  0
);


@Injectable({
  providedIn: 'root',
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
  private _timeColumnAsDateArray: Date[][] = [];
  private _timeIntervalInMinutes: number = 0;

  private _objComparisonHelper: ObjectsComparisonHelper;

  constructor() {
    this.buildDefaultTable(
      sectors,
      employees,
      shiftStartTime,
      shiftEndTime,
      new Date(),
      10
    );
    this._objComparisonHelper = new ObjectsComparisonHelper();
  }
  ngOnInit(): void {
    this.buildTable();
  }

  private buildDefaultTable(
    sectors: ISector[],
    employees: IEmployee[],
    shiftStartTime: Date,
    shiftEndTime: Date,
    shiftDate: Date,
    timeIntervalInMinutes: number
  ) {
    let defaultTableBuilder = new DefaultTableBuilder(
      sectors,
      employees,
      shiftStartTime,
      shiftEndTime,
      shiftDate,
      timeIntervalInMinutes
    );
    this._employeesTableAs2DArray =
      defaultTableBuilder.tableForEmployeesAs2DArray;
    this._tableForMatTable = defaultTableBuilder.defaultTableForMatTable;
    this._timeColumnAsDateArray = defaultTableBuilder.timeColumnAsDateArray;
    this._timeColumnAsStringArray = defaultTableBuilder.timeColumnAsStringArray;
    this._timeIntervalInMinutes = defaultTableBuilder.timeIntervalInMinutes;
    this.displayColumns = defaultTableBuilder.displayedColumns;
    this.employeesForShift = defaultTableBuilder.employees;
    this.sectorsForShift = defaultTableBuilder.sectors;
  }

  //Call this method every time we change _employeesTableAs2DArray
  private buildTable() {
    let table: ITableRow[] = [];

    for (let i = 0; i < this._timeColumnAsStringArray.length; i++) {
      let sectorsRow: IEmployeesRow = {};
      for (let j = 0; j < this.sectorsForShift.length; j++) {
        sectorsRow[this.sectorsForShift[j].name] =
          this._employeesTableAs2DArray[i][j];
      }
      table.push({
        time: this._timeColumnAsStringArray[i],
        ...sectorsRow,
      });
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
  public setEmployeeInRow(
    employee: IEmployee,
    rowNumber: number,
    columnNumber: number
  ) {
    let rowToChange: (IEmployee | undefined)[] =
      this._employeesTableAs2DArray[rowNumber];
    let employeeToChange: IEmployee | undefined = rowToChange[columnNumber];

    //Check in the employee already works on different sector at this time
    if (
      this._objComparisonHelper.ifEmployeesRowHasEmployee(rowToChange, employee)
    ) {
      console.log(
        `Can not set ${employee.name} at the same time on different sector!`
      );
      return;
    }
    //Then check if we are trying to change the employee to another employee
    //If the employee that we try to change is in the middle of work session:
    //0 [e1, e2]
    //1 [e1, e2]
    //2 [e1, e2]
    //3 [e1, e2] <-- trying to change e1 to e3 here
    //4 [e1, e2]
    //5 [e1, e2]
    //Change all e1 after that to undefined:
    //0 [e1, e2]
    //1 [e1, e2]
    //2 [e1, e2]
    //3 [e3, e2] <-- changed e1 to e3 here
    //4 [undefined, e2]
    //5 [undefined, e2]
    let previousRowNumber = rowNumber - 1;
    let nextRowNumber = rowNumber + 1;
    if (
      previousRowNumber >= 0 &&
      nextRowNumber < this._employeesTableAs2DArray.length
    ) {
      let ifPreviousRowHasEmployeeToChange =
        this._objComparisonHelper.ifEmployeesRowHasEmployee(
          this._employeesTableAs2DArray[previousRowNumber],
          employeeToChange
        );
      let ifNextRowHasEmployeeToChange =
        this._objComparisonHelper.ifEmployeesRowHasEmployee(
          this._employeesTableAs2DArray[nextRowNumber],
          employeeToChange
        );
      if (
        JSON.stringify(employeeToChange) !== JSON.stringify(employee) &&
        ifPreviousRowHasEmployeeToChange &&
        ifNextRowHasEmployeeToChange
      ) {
        while (
          nextRowNumber < this._employeesTableAs2DArray.length &&
          this._objComparisonHelper.ifEmployeesRowHasEmployee(
            this._employeesTableAs2DArray[nextRowNumber],
            employeeToChange
          )
        ) {
          const indexOfEmployeeToChange = this._employeesTableAs2DArray[
            nextRowNumber
          ].findIndex((e) =>
            this._objComparisonHelper.ifTwoObjectsAreEqual(e, employeeToChange)
          );
          this._employeesTableAs2DArray[nextRowNumber][
            indexOfEmployeeToChange
          ] = undefined;
          nextRowNumber++;
        }
      }
    }
    if (JSON.stringify(employeeToChange) !== JSON.stringify(employee)) {
      employeeToChange = employee;
      this._employeesTableAs2DArray[rowNumber][columnNumber] = employeeToChange;
      this.buildTable();
    } else {
      console.log('Error adding the same employee at the same time');
      return;
    }
  }

  public getEmployeesForSelection(
    rowNumber: number,
    sector: ISector
  ): IEmployee[] {
    return new EmployeesWhoCanWorkEvaluator().getEmployeesWhoCanWork(
      this.employeesForShift,
      rowNumber,
      this._employeesTableAs2DArray,
      60,
      120,
      10,
      20,
      this._timeIntervalInMinutes,
      sector
    );
  }

  public getWorkAndRestTimeInfo(
    employee: IEmployee,
    rowNumber: number
  ): IWorkAndRestTimeInfo {
    return new EmployeesWhoCanWorkEvaluator().getWorkAndRestTimeInfo(
      employee,
      rowNumber,
      this._employeesTableAs2DArray,
      this._timeIntervalInMinutes
    );
  }

  public getEmployeeByRowAnColumnNumber(
    rowNumber: number,
    columnNumber: number
  ): IEmployee | undefined {
    let row = this._employeesTableAs2DArray[rowNumber];
    let employee = row[columnNumber];
    return employee;
  }
}
