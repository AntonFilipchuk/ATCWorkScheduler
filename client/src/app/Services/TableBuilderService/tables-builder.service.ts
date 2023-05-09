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
import { ISmallTableInfo } from 'src/app/models/ISmallTableInfo';






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

  private _$smallTables: ReplaySubject<ISmallTableInfo[]> =
    new ReplaySubject<ISmallTableInfo[]>();


  public displayColumns: string[] = [];
  public employees: IEmployee[] = [];
  public sectors: ISector[] = [];


  public tablesForEachEmployee: ISmallTableInfo[] = [];

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

  public getSmallTablesObservable(): Observable<ISmallTableInfo[]>
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



  private setEmployeeAndUpdateTables(
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
      this.setEmployeeAndUpdateTables(employee, rowNumber, columnNumber);
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
          this.setEmployeeAndUpdateTables(undefined, rowNumber, columnNumber);
          nextRowNumber++;
        }
        this._employeesTableAs2DArray[rowNumber][columnNumber] = employeeToChange;
        this.setEmployeeAndUpdateTables(employeeToChange, rowNumber, columnNumber);
        return;
      }
    }
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

    //Sort by name
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


  public buildSmallTables(): ISmallTableInfo[]
  {
    let tablesInfo: ISmallTableInfo[] = [];

    for (let employeeNumber = 0; employeeNumber < this.employees.length; employeeNumber++)
    {
      const employee = this.employees[employeeNumber];
      let smallTableInfo: ISmallTableRow[] = [];
      let sectors: Set<string> = new Set<string>();

      for (let rowNumber = 0; rowNumber < this._employeesTableAs2DArray.length; rowNumber++)
      {
        const row = this._employeesTableAs2DArray[rowNumber];
        let employeePositionInRow: number = this._objComparisonHelper.getPositionOfEmployeeInRow(row, employee);
        if (employeePositionInRow >= 0)
        {
          const startTimeRowNumber: number = rowNumber;
          let startTimeAsDate: Date = this._timeColumnAsDateArray[rowNumber][0];
          while (
            rowNumber < this._employeesTableAs2DArray.length - 1 &&
            this._objComparisonHelper.ifEmployeesRowHasEmployee(this._employeesTableAs2DArray[rowNumber + 1], employee)
            && this._objComparisonHelper.getPositionOfEmployeeInRow(this._employeesTableAs2DArray[rowNumber + 1], employee) === employeePositionInRow)
          {
            rowNumber++;
          }

          const endTimeRowNumber: number = rowNumber;
          let endTimeAsDate: Date = this._timeColumnAsDateArray[rowNumber][1];
          smallTableInfo.push(
            {
              timeStartRowNumber: startTimeRowNumber,
              timeEndRowNumber: endTimeRowNumber,
              timeIntervalAsDate: [startTimeAsDate, endTimeAsDate],
              sector: this.sectors[employeePositionInRow].name
            }
          );
          sectors.add(this.sectors[employeePositionInRow].name);
        }
      }

      let sectorsAsString: string = this.formatSectorNames(sectors);

      tablesInfo.push(
        {
          sectors: sectorsAsString,
          employeeId: employee.id,
          employeeName: employee.name,
          table: smallTableInfo
        }
      );
    }
    return tablesInfo;
  }


  private formatSectorNames(sectors: Set<string>): string
  {
    let sectorsSetToArray: string[] = Array.from(sectors);
    if (sectorsSetToArray.length == 0)
    {
      return 'N/A';
    }
    else if (sectorsSetToArray.length === 1)
    {
      return sectorsSetToArray[0];
    } else if (sectorsSetToArray.length > 2)
    {
      return 'Stand-in';
    }
    else 
    {
      return `${sectorsSetToArray[0]}/${sectorsSetToArray[1]}`;
    }
  }


  public deleteWorkSession(timeStartRowNumber: number, timeEndRowNumber: number, sectorName: string)
  {
    let numberOfSector = this.sectors.findIndex((s) => s.name === sectorName);
    for (let rowNumber = timeStartRowNumber; rowNumber <= timeEndRowNumber; rowNumber++)
    {
      this.setEmployeeAndUpdateTables(undefined, rowNumber, numberOfSector);
    }
  }

  public getAvailableStartTimeIntervals(employee: IEmployee): Date[][]
  {
    let timeIntervals: Date[][] = [];

    for (let rowNumber = 0; rowNumber < this._employeesTableAs2DArray.length; rowNumber++)
    {
      const row = this._employeesTableAs2DArray[rowNumber];
      if (new EmployeesWhoCanWorkEvaluator().ifEmployeeCanBeAddedForSelection(
        employee,
        rowNumber,
        this._employeesTableAs2DArray,
        this._maxWorkTimeInMinutes,
        this._minRestTimeInMinutes,
        this._timeIntervalInMinutes))
      {
        timeIntervals.push(this._timeColumnAsDateArray[rowNumber]);
      }
    }
    return timeIntervals;
  }

  public getAvailableEndTimeIntervals(employee: IEmployee, selectedStartTimeInterval: Date[], sector: ISector): Date[][]
  {
    let timeIntervals: Date[][] = [];
    let rowNumber: number = this._timeColumnAsDateArray.findIndex((timeInterval) => timeInterval === selectedStartTimeInterval);
    let columnNumber: number = this.sectors.findIndex((s) => s.name === sector.name);
    let rowsWhereCanBeSet: number[] = new EmployeesWhoCanWorkEvaluator().getRowsNumbersWereEmployeeCanBeSet(
      employee,
      rowNumber,
      columnNumber,
      this._employeesTableAs2DArray,
      this._maxWorkTimeInMinutes,
      this._minRestTimeInMinutes,
      this._timeIntervalInMinutes);
    console.log(rowsWhereCanBeSet);
    rowsWhereCanBeSet.forEach((n) => timeIntervals.push(this._timeColumnAsDateArray[n]));
    console.log(timeIntervals);

    return timeIntervals;
  }
}
