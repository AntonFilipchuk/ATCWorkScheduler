import { IEmployee } from '../models/IEmployee';
import { ISector } from '../models/ISector';
import { ITableRow } from '../models/ITableRow';
import { DefaultTableBuilder } from './DefaultTableBuilder';

describe('DefaultTableBuilder', () => {
  let g12r: ISector = { name: 'G12R' };
  let g12p: ISector = { name: 'G12P' };
  let e1: IEmployee = {
    id: 1,
    name: 'Filipchuk',
    totalTime: 0,
    sectorPermits: [g12r, g12p],
    color: 'red',
  };

  let e2: IEmployee = {
    id: 2,
    name: 'Egorov',
    totalTime: 0,
    sectorPermits: [g12r, g12p],
    color: 'green',
  };

  let e3: IEmployee = {
    id: 3,
    name: 'Gallyamov',
    totalTime: 0,
    sectorPermits: [g12r, g12p],
    color: 'yellow',
  };

  let e4: IEmployee = {
    id: 4,
    name: 'Nosenko',
    totalTime: 0,
    sectorPermits: [g12r, g12p],
    color: 'orange',
  };
  let sectors: ISector[] = [g12r, g12p];
  let employees: IEmployee[] = [e1, e2, e3, e4];

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
    9,
    0
  );
  let dTB = new DefaultTableBuilder(
    sectors,
    employees,
    shiftStartTime,
    shiftEndTime,
    todayDate,
    10
  );
  it('should get tableForEmployeesAs2DArray', () => {
    let expectedTable: undefined[][] = [
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
      [undefined, undefined],
    ];

    expect(dTB.tableForEmployeesAs2DArray).toEqual(expectedTable);
  });

  it('should get displayedColumns', () => {
    let expectedDisplayedColumns: string[] = ['time', 'G12R', 'G12P'];
    expect(dTB.displayedColumns).toEqual(expectedDisplayedColumns);
  });

  it('should get defaultTableForMatTable', () => {
    let expectedDefaultTableForMatTable: ITableRow[] = [
        {time : '08:00 - 08:10', 0 : undefined, 1 : undefined},
        {time : '08:10 - 08:20', 0 : undefined, 1 : undefined},
        {time : '08:20 - 08:30', 0 : undefined, 1 : undefined},
        {time : '08:30 - 08:40', 0 : undefined, 1 : undefined},
        {time : '08:40 - 08:50', 0 : undefined, 1 : undefined},
        {time : '08:50 - 09:00', 0 : undefined, 1 : undefined}
    ];
    expect(dTB.defaultTableForMatTable).toEqual(expectedDefaultTableForMatTable);
  });

  it('should get employeesForShift', () => {
    let expectedEmployeesForShift: IEmployee[] = [e1, e2,e3,e4];
    expect(dTB.employeesForShift).toEqual(expectedEmployeesForShift);
  });
});


