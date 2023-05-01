import { Inject, Injectable, OnInit } from '@angular/core';
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
import { StartingDataEvaluatorService } from '../StartingDataEvaluatorService/starting-data-evaluator.service';

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
export class TablesBuilderService {
  private _$table = new ReplaySubject<ITableRow[]>();
  private _$columnNumberWhereSelectionIsActive: ReplaySubject<number> =
    new ReplaySubject<number>();
  public displayColumns: string[] = [];
  public employees: IEmployee[] = [];
  public sectors: ISector[] = [];

  private _employeesTableAs2DArray: (IEmployee | undefined)[][] = [];
  private _tableForMatTable: ITableRow[] = [];
  private _timeColumnAsStringArray: string[] = [];
  private _timeColumnAsDateArray: Date[][] = [];
  private _timeIntervalInMinutes: number = 0;
  private _maxWorkTimeInMinutes: number = 0;
  private _minRestTimeInMinutes: number = 0;

  private _objComparisonHelper: ObjectsComparisonHelper;

  constructor(private sde: StartingDataEvaluatorService) {
    this.displayColumns = sde.displayedColumns;
    this.employees = sde.employees;
    this.sectors = sde.sectors;
    this._employeesTableAs2DArray = sde.employeesTableAs2DArray;
    this._tableForMatTable = sde.defaultTableForMatTable;
    this._timeColumnAsStringArray = sde.timeColumnAsStringArray;
    this._timeColumnAsDateArray = sde.timeColumnAsDateArray;
    this._timeIntervalInMinutes = sde.timeIntervalInMinutes;
    this._maxWorkTimeInMinutes = sde.maxWorkTimeInMinutes;
    this._minRestTimeInMinutes = sde.minRestTimeInMinutes;

    this._$columnNumberWhereSelectionIsActive.next(-1);

    this._objComparisonHelper = new ObjectsComparisonHelper();
    this.buildTable();
  }

  //Call this method every time we change _employeesTableAs2DArray
  private buildTable() {
    let table: ITableRow[] = [];

    for (let i = 0; i < this._timeColumnAsStringArray.length; i++) {
      let sectorsRow: IEmployeesRow = {};
      for (let j = 0; j < this.sectors.length; j++) {
        sectorsRow[this.sectors[j].name] = this._employeesTableAs2DArray[i][j];
      }
      table.push({
        time: this._timeColumnAsStringArray[i],
        ...sectorsRow,
      });
    }
    this._$table.next(table);
  }

  public getColumnNumberWhereSelectionIsActiveForSubscription(): Observable<number> {
    return this._$columnNumberWhereSelectionIsActive;
  }

  public setColumnNumberWhereSelectionIsActive(columnNumber: number) {
    this._$columnNumberWhereSelectionIsActive.next(columnNumber);
  }

  public getTableForSubscription(): Observable<ITableRow[]> {
    this._$table.next(this._tableForMatTable);
    return this._$table;
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
        `Can not set ${employee.name} at the same time on different sector! Row number: ${rowNumber}, Column Number ${columnNumber}`
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

  public getRowsNumbers(
    employee: IEmployee,
    rowNumber: number,
    columnNumber: number
  ) {
    return new EmployeesWhoCanWorkEvaluator().getRowsNumbersWereEmployeeCanBeSet(
      employee,
      rowNumber,
      columnNumber,
      this._employeesTableAs2DArray,
      this._maxWorkTimeInMinutes,
      this._minRestTimeInMinutes,
      this._timeIntervalInMinutes
    );
  }

  public getEmployeesForSelection(
    rowNumber: number,
    sector: ISector
  ): IEmployee[] {
    return new EmployeesWhoCanWorkEvaluator().getEmployeesWhoCanWork(
      this.employees,
      rowNumber,
      this._employeesTableAs2DArray,
      this._maxWorkTimeInMinutes,
      this._minRestTimeInMinutes,
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
