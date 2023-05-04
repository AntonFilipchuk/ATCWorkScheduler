import { Injectable } from '@angular/core';
import { IEmployee } from '../../models/IEmployee';
import { IEmployeesRow } from '../../models/IEmployeesRow';
import { Observable, ReplaySubject } from 'rxjs';

import { ITableRow } from '../../models/ITableRow';
import { ISector } from '../../models/ISector';
import { ObjectsComparisonHelper } from '../../Helpers/ObjectsComparisonHelper';
import { IWorkAndRestTimeInfo } from '../../models/IWorkAndRestTimeInfo';
import { EmployeesWhoCanWorkEvaluator } from '../../Helpers/EmployeesWhoCanWorkEvaluator';
import { StartingDataEvaluatorService } from '../StartingDataEvaluatorService/starting-data-evaluator.service';
import { ISmallTableRow } from 'src/app/models/ISmallTableRow';
import { ISmallTable } from 'src/app/models/ISmallTable';






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

export class TablesBuilderService
{
  private _$columnNumberWhereSelectionIsActive: ReplaySubject<number> =
    new ReplaySubject<number>();

  private _$rowNumberOfSelectedEmployee: ReplaySubject<number> =
    new ReplaySubject<number>();

  private _$employeeWhoWasChosenForSelection: ReplaySubject<IEmployee | undefined> =
    new ReplaySubject<IEmployee | undefined>();

  private _$ifMouseTouchedAgainRowWhereEmployeeWasSelected: ReplaySubject<boolean> =
    new ReplaySubject<boolean>();

  private _$employeesTableAs2DArray: ReplaySubject<(IEmployee | undefined)[][]> =
    new ReplaySubject<(IEmployee | undefined)[][]>();

  private _$smallTables: ReplaySubject<ISmallTable[]> =
    new ReplaySubject<ISmallTable[]>();


  public displayColumns: string[] = [];
  public employees: IEmployee[] = [];
  public sectors: ISector[] = [];


  public tablesForEachEmployee: ISmallTable[] = [];

  private _tableForMatTable: ITableRow[] = [];
  public get tableForMatTable(): ITableRow[]
  {
    return this._tableForMatTable;
  }

  private _employeesTableAs2DArray: (IEmployee | undefined)[][] = [];
  private _timeColumnAsStringArray: string[] = [];
  private _timeColumnAsDateArray: Date[][] = [];
  private _timeIntervalInMinutes: number = 0;
  private _maxWorkTimeInMinutes: number = 0;
  private _minRestTimeInMinutes: number = 0;

  private _objComparisonHelper: ObjectsComparisonHelper;

  constructor (private sde: StartingDataEvaluatorService)
  {
    this._objComparisonHelper = new ObjectsComparisonHelper();
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
    this._$rowNumberOfSelectedEmployee.next(-1);
    this._$ifMouseTouchedAgainRowWhereEmployeeWasSelected.next(false);
    this._$smallTables.next(this.buildSmallTables());

  }

  public getSmallTablesObservable(): Observable<ISmallTable[]>
  {
    return this._$smallTables;
  }

  public getEmployeesTableAs2DArrayObservable(): Observable<(IEmployee | undefined)[][]> 
  {
    this._$employeesTableAs2DArray.next(this._employeesTableAs2DArray);
    return this._$employeesTableAs2DArray;
  }

  public getIfMouseTouchedAgainRowWhereEmployeeWasSelectedObservable(): Observable<boolean>
  {
    return this._$ifMouseTouchedAgainRowWhereEmployeeWasSelected;
  }

  public setIfMouseTouchedAgainRowWhereEmployeeWasSelected(state: boolean): void
  {
    this._$ifMouseTouchedAgainRowWhereEmployeeWasSelected.next(state);
  }

  public getEmployeeWhoWasChosenForSelectionObservable(): Observable<IEmployee | undefined>
  {
    return this._$employeeWhoWasChosenForSelection;
  }

  public setEmployeeWhoWasChosenForSelection(employee: IEmployee | undefined): void
  {
    this._$employeeWhoWasChosenForSelection.next(employee);
  }

  public getRowNumberOfSelectedEmployeeObservable(): Observable<number> 
  {
    return this._$rowNumberOfSelectedEmployee;
  }

  public setRowNumberOfSelectedEmployee(rowNumber: number): void
  {
    this._$rowNumberOfSelectedEmployee.next(rowNumber);
  }

  public getColumnNumberWhereSelectionIsActiveObservable(): Observable<number>
  {
    return this._$columnNumberWhereSelectionIsActive;
  }

  public setColumnNumberWhereSelectionIsActive(columnNumber: number): void
  {
    this._$columnNumberWhereSelectionIsActive.next(columnNumber);
  }



  private buildTable(
    employee: IEmployee | undefined,
    rowNumber: number,
    columnNumber: number
  )
  {
    this._employeesTableAs2DArray[rowNumber][columnNumber] = employee;
    this._$employeesTableAs2DArray.next(this._employeesTableAs2DArray);
    this._$smallTables.next(this.buildSmallTables());
  }

  public setEmployeeInRow(
    employee: IEmployee,
    rowNumber: number,
    columnNumber: number
  )
  {
    let employeeToChange: IEmployee | undefined = this._employeesTableAs2DArray[rowNumber][columnNumber];

    this.checkIfTryingToAddInTheMiddle(
      employee,
      rowNumber,
      columnNumber,
      employeeToChange
    );

    if (employeeToChange?.id !== employee.id)
    {
      employeeToChange = employee;
      this._employeesTableAs2DArray[rowNumber][columnNumber] = employeeToChange;
      this.buildTable(employee, rowNumber, columnNumber);
    }
  }

  private checkIfTryingToAddInTheMiddle(
    employee: IEmployee,
    rowNumber: number,
    columnNumber: number,
    employeeToChange: IEmployee | undefined
  )
  {
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
    )
    {
      let ifPreviousRowHasEmployeeToChange = this._objComparisonHelper.ifEmployeesRowHasEmployee(this._employeesTableAs2DArray[previousRowNumber], employeeToChange);
      let ifNextRowHasEmployeeToChange = this._objComparisonHelper.ifEmployeesRowHasEmployee(this._employeesTableAs2DArray[nextRowNumber], employeeToChange);
      if (
        employeeToChange?.id !== employee.id &&
        ifPreviousRowHasEmployeeToChange &&
        ifNextRowHasEmployeeToChange
      )
      {
        while (
          nextRowNumber < this._employeesTableAs2DArray.length &&
          this._objComparisonHelper.ifEmployeesRowHasEmployee(this._employeesTableAs2DArray[nextRowNumber], employeeToChange)
        )
        {
          const indexOfEmployeeToChange = this._employeesTableAs2DArray[nextRowNumber].findIndex((e) => e?.id === employeeToChange?.id);

          this._employeesTableAs2DArray[nextRowNumber][indexOfEmployeeToChange] = undefined;
          this.buildTable(undefined, rowNumber, columnNumber);
          nextRowNumber++;
        }
        this._employeesTableAs2DArray[rowNumber][columnNumber] = employeeToChange;
        this.buildTable(employeeToChange, rowNumber, columnNumber);
        return;
      }
    }
  }

  public getRowsNumbers(
    employee: IEmployee,
    rowNumber: number,
    columnNumber: number
  )
  {
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

  public getEmployeesForSelection(rowNumber: number, columnNumber: number, sector: ISector): IEmployee[]
  {
    let employee = this._employeesTableAs2DArray[rowNumber][columnNumber];

    let employeesWhoCanWork = new EmployeesWhoCanWorkEvaluator().getEmployeesWhoCanWork(
      this.employees,
      rowNumber,
      this._employeesTableAs2DArray,
      this._maxWorkTimeInMinutes,
      this._minRestTimeInMinutes,
      this._timeIntervalInMinutes,
      sector
    );

    //Add an employee when we select a cell were he is already present
    if (employee)
    {
      employeesWhoCanWork = [employee, ...employeesWhoCanWork];
    }
    return employeesWhoCanWork.sort((e1, e2) => 
    {
      if (e1.name < e2.name)
      {
        return -1;
      }
      if (e1.name > e2.name)
      {
        return 1;
      }
      return 0;
    });
  }

  public getWorkAndRestTimeInfo(
    employee: IEmployee,
    rowNumber: number
  ): IWorkAndRestTimeInfo
  {
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
  ): IEmployee | undefined
  {
    let row = this._employeesTableAs2DArray[rowNumber];
    let employee = row[columnNumber];
    return employee;
  }


  public buildSmallTables()
  {
    let tables: ISmallTable[] = [];
    for (let i = 0; i < this.employees.length; i++)
    {
      const employee = this.employees[i];
      let smallTable: ISmallTableRow[] = [];
      let sectors: Set<string> = new Set<string>();
      for (let j = 0; j < this._employeesTableAs2DArray.length; j++)
      {
        const row = this._employeesTableAs2DArray[j];
        let employeePositionInRow: number = this._objComparisonHelper.getPositionOfEmployeeInRow(row, employee);
        if (employeePositionInRow >= 0)
        {
          let startTime: string = this._timeColumnAsStringArray[j].slice(0, 5);
          let startTimeAsDate : Date = this._timeColumnAsDateArray[j][0];
          while (
            this._objComparisonHelper.ifEmployeesRowHasEmployee(this._employeesTableAs2DArray[j + 1], employee)
            && this._objComparisonHelper.getPositionOfEmployeeInRow(this._employeesTableAs2DArray[j + 1], employee) === employeePositionInRow)
          {
            j++;
          }
          let endTime: string = this._timeColumnAsStringArray[j].slice(8, 13);
          let endTimeAsDate : Date = this._timeColumnAsDateArray[j][1];
          smallTable.push(
            {
              timeIntervalAsDate : [startTimeAsDate, endTimeAsDate],
              timeInterval: `${startTime} - ${endTime}`,
              sector: this.sectors[employeePositionInRow].name
            }
          );
          sectors.add(this.sectors[employeePositionInRow].name);
        }
      }

      let sectorsAsString: string = '';
      let setToArray: string[] = Array.from(sectors);

      for (let n = 0; n < setToArray.length; n++)
      {
        const sector = setToArray[n];

        if (n === 0)  
        {
          sectorsAsString += `${sector}/`;
        }
        else if (n === setToArray.length - 1)
        {
          sectorsAsString += `${sector}`;
        }
        else
        {
          sectorsAsString += `${sector}/`;
        }

      }

      tables.push(
        {
          sectors: sectorsAsString,
          employeeId: employee.id,
          employeeName: employee.name,
          table: smallTable
        }
      );
    }
    return tables;
  }
  public getTotalWorkAndRestTimeForEmployee(employee: IEmployee): [number, number]
  {
    let workTime: number = 0;
    let restTime: number = 0;
    for (let i = 0; i < this._employeesTableAs2DArray.length; i++)
    {
      const row = this._employeesTableAs2DArray[i];
      if (this._objComparisonHelper.ifEmployeesRowHasEmployee(row, employee))
      {
        workTime += this._timeIntervalInMinutes;
      }
      else
      {
        restTime += this._timeIntervalInMinutes;
      }
    }
    return [workTime, restTime];
  }
}
