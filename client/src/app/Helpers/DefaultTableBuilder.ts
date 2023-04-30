//Take number of sectors for the shift
//Take start and end time of the shift
//Take the number of people for the shift
//Check if each employee can work at least at one workplace
//Check if there are enough employees for the shift

//Return :
//time array ['8:10'. '8.20']
//Default employees table as 2d Array
//Full build default table for mat table to consume
//

import { IEmployee } from '../models/IEmployee';
import { ISector } from '../models/ISector';
import { ITableRow } from '../models/ITableRow';
import { ObjectsComparisonHelper } from './ObjectsComparisonHelper';
import { TimeConfigurator } from './TimeConfigurator';

export class DefaultTableBuilder {
  public get timeColumnAsStringArray(): string[] {
    return this._timeConfigurator.timeColumnAsStringArray;
  }

  public get timeColumnAsDateArray(): Date[][] {
    return this._timeConfigurator.timeColumnAsDateArray;
  }

  public get tableForEmployeesAs2DArray(): (IEmployee | undefined)[][] {
    return this.buildTableForEmployeesAs2DArray(
      this._sectors,
      this.timeColumnAsStringArray
    );
  }

  public get defaultTableForMatTable(): ITableRow[] {
    return this.buildDefaultTableForMatTable(
      this.timeColumnAsStringArray,
      this.tableForEmployeesAs2DArray
    );
  }

  public get displayedColumns(): string[] {
    return this.buildDisplayedColumns(this._sectors);
  }

  public get employees(): IEmployee[] {
    return this._employees;
  }

  public get sectors(): ISector[] {
    return this._sectors;
  }

  public get timeIntervalInMinutes(): number {
    return this._intervalInMinutes;
  }

  public get maxWorkTimeInMinutes(): number {
    return this._maxWorkTimeInMinutes;
  }

  public get minRestTimeInMinutes(): number {
    return this._minRestTimeInMinutes;
  }

  private _objComparisonHelper: ObjectsComparisonHelper;
  private _timeConfigurator: TimeConfigurator;

  //------------------------
  //Sectors - check if no duplicates and has at least 1 sector
  //------------------------
  //Employees - check if no duplicates
  //Enough employees for the shift
  //Employees have permits
  //Enough employees for each sector
  //------------------------
  //ShiftDate - check if it's not in the past
  //ShiftStartTime - check if it's the same day as shiftDate and it's before ShiftEndTime
  //ShiftEndTime - check if it's the same day as shiftDate or the next day, it's after shiftStartTime
  //and shiftEndTime - shiftStartTime <= 12 hours
  //------------------------
  //FirstMaxWorkTimeInMinutes - check if it's less than SecondMaxWorkTimeInMinutes
  //FirstMinRestTimeInMinutes - check if it's less than SecondMinRestTimeInMinutes

  constructor(
    private _sectors: ISector[],
    private _employees: IEmployee[],
    private _shiftStartTimeDate: Date,
    private _shiftEndTimeDate: Date,
    private _shiftDate: Date,
    private _intervalInMinutes: number,
    private _maxWorkTimeInMinutes: number,
    private _minRestTimeInMinutes: number
  ) {
    this._objComparisonHelper = new ObjectsComparisonHelper();

    this._timeConfigurator = new TimeConfigurator(
      _shiftStartTimeDate.getHours(),
      _shiftStartTimeDate.getMinutes(),
      _shiftEndTimeDate.getHours(),
      _shiftEndTimeDate.getMinutes(),
      _shiftDate,
      _intervalInMinutes,
      _maxWorkTimeInMinutes,
      _minRestTimeInMinutes
    );

    this.ifNoDuplicatesInArray(_employees);
    this.ifNoDuplicatesInArray(_sectors);
    this.ifMinimumAmountOfEmployees(_sectors, _employees);
    this.ifAllEmployeesCanWorkAtLeastOnOneSectors(_sectors);
  }

  //Display columns for Mat Table string[]
  // ['time', 'G12R', ... , 'G345P']
  private buildDisplayedColumns(sectors: ISector[]): string[] {
    let sectorNames: string[] = [];
    sectors.forEach((sector) => {
      sectorNames.push(sector.name);
    });
    return ['time', ...sectorNames];
  }

  //Table row:
  // {time: Date, undefined, undefined, ... , undefined}
  private buildDefaultTableForMatTable(
    timeColumnAsStringArray: string[],
    tableForEmployeesAs2DArray: (IEmployee | undefined)[][]
  ): ITableRow[] {
    let table: ITableRow[] = [];
    for (let i = 0; i < this.timeColumnAsDateArray.length; i++) {
      let defaultTableRow: ITableRow = {
        time: timeColumnAsStringArray[i],
        ...tableForEmployeesAs2DArray[i],
      };
      table.push(defaultTableRow);
    }
    return table;
  }

  private buildTableForEmployeesAs2DArray(
    sectors: ISector[],
    timeColumn: string[] | Date[]
  ): (IEmployee | undefined)[][] {
    let employees2DTable: (IEmployee | undefined)[][] = [];
    timeColumn.forEach((time) => {
      let employeeRow: (IEmployee | undefined)[] = [];
      sectors.forEach((sector) => {
        employeeRow.push(undefined);
      });
      employees2DTable.push(employeeRow);
    });
    return employees2DTable;
  }

  private ifNoDuplicatesInArray(array: any[]) {
    const result: any[] = [];
    for (const item of array) {
      if (!result.includes(item)) {
        result.push(item);
      } else {
        throw new Error(
          `An array ${JSON.stringify(array)} has a duplicate ${JSON.stringify(
            item
          )}!`
        );
      }
    }
  }

  //employeesSectors = [{name: 'G12R'}, {name: 'G12P'}]
  //_sectors = [{name: 'G12R'}, {name: 'G12P'}, {name: 'G345R'}, {name: 'G345P'}]
  private ifAllEmployeesCanWorkAtLeastOnOneSectors(sectors: ISector[]) {
    this._employees.forEach((employee) => {
      if (
        !sectors.some((sector) =>
          employee.sectorPermits.some((s) => s.name === sector.name)
        )
      ) {
        let employeeWhoCantWorkSectorPermits: string[] = [];
        employee.sectorPermits.forEach((sector) => {
          employeeWhoCantWorkSectorPermits.push(sector.name);
        });
        let neededPermits: string[] = [];
        sectors.forEach((sector) => {
          neededPermits.push(sector.name);
        });

        throw new Error(
          `Employee ${employee.name} cannot work \n ${employee.name}'s permits: ${employeeWhoCantWorkSectorPermits} \n Needed permits: ${neededPermits}`
        );
      }
    });
  }

  //Calculate if we have enough employees for the shift
  //We need at least 5 people for 4 workplaces
  //So if we have less then 1.25 people per sector => can't work
  private ifMinimumAmountOfEmployees(
    sectors: ISector[],
    employees: IEmployee[]
  ) {
    let numberOfSectors: number = sectors.length;
    let numberOfEmployees: number = employees.length;
    let ifCanWork: boolean = numberOfEmployees / numberOfSectors >= 1.25;
    if (!ifCanWork) {
      throw new Error(
        `Not enough people for work! Coefficient : ${
          numberOfEmployees / numberOfSectors
        }`
      );
    }
  }
}
