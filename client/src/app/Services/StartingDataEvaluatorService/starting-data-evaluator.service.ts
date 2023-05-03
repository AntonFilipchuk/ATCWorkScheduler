import { Injectable, OnInit } from '@angular/core';
import { min } from 'rxjs';
import { DefaultTableBuilder } from 'src/app/Helpers/DefaultTableBuilder';
import { IEmployee } from 'src/app/models/IEmployee';
import { ISector } from 'src/app/models/ISector';
import { ITableRow } from 'src/app/models/ITableRow';

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
  14,
  40
);
let shiftEndTime: Date = new Date(
  todayDate.getDate(),
  todayDate.getMonth(),
  todayDate.getDate(),
  21,
  50
);

let timeIntervalInMinutes = 10;
let maxWorkTimeInMinutes = 120;
let minRestTimeInMinutes = 20;

@Injectable({
  providedIn: 'root',
})
export class StartingDataEvaluatorService {
  public defaultTableForMatTable: ITableRow[] = [];
  public displayedColumns: string[] = [];
  public employees: IEmployee[] = [];
  public sectors: ISector[] = [];
  public employeesTableAs2DArray: (IEmployee | undefined)[][] = [];
  public timeColumnAsDateArray: Date[][] = [];
  public timeColumnAsStringArray: string[] = [];
  public timeIntervalInMinutes: number = 0;
  public maxWorkTimeInMinutes : number = 0;
  public minRestTimeInMinutes : number = 0;
  constructor() {
    this.configureInitialValues(
      sectors,
      employees,
      shiftStartTime,
      shiftEndTime,
      todayDate,
      timeIntervalInMinutes,
      maxWorkTimeInMinutes,
      minRestTimeInMinutes
    );
  }

  public configureInitialValues(
    sectors: ISector[],
    employees: IEmployee[],
    shiftStartTime: Date,
    shiftEndTime: Date,
    shiftDate: Date,
    timeIntervalInMinutes: number,
    maxWorkTimeInMinutes: number,
    minRestTimeInMinutes: number
  ) {
    let defaultTableBuilder = new DefaultTableBuilder(
      sectors,
      employees,
      shiftStartTime,
      shiftEndTime,
      shiftDate,
      timeIntervalInMinutes,
      maxWorkTimeInMinutes,
      minRestTimeInMinutes
    );

    this.defaultTableForMatTable = defaultTableBuilder.defaultTableForMatTable;
    this.displayedColumns = defaultTableBuilder.displayedColumns;
    this.employees = defaultTableBuilder.employees;
    this.sectors = defaultTableBuilder.sectors;
    this.employeesTableAs2DArray =
      defaultTableBuilder.tableForEmployeesAs2DArray;
    this.timeColumnAsDateArray = defaultTableBuilder.timeColumnAsDateArray;
    this.timeColumnAsStringArray = defaultTableBuilder.timeColumnAsStringArray;
    this.timeIntervalInMinutes = defaultTableBuilder.timeIntervalInMinutes;
    this.maxWorkTimeInMinutes = defaultTableBuilder.maxWorkTimeInMinutes;
    this.minRestTimeInMinutes = defaultTableBuilder.minRestTimeInMinutes;
  }
}
