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
      { time: '08:00 - 08:10', 0: undefined, 1: undefined },
      { time: '08:10 - 08:20', 0: undefined, 1: undefined },
      { time: '08:20 - 08:30', 0: undefined, 1: undefined },
      { time: '08:30 - 08:40', 0: undefined, 1: undefined },
      { time: '08:40 - 08:50', 0: undefined, 1: undefined },
      { time: '08:50 - 09:00', 0: undefined, 1: undefined },
    ];
    expect(dTB.defaultTableForMatTable).toEqual(
      expectedDefaultTableForMatTable
    );
  });

  it('should get employeesForShift', () => {
    let expectedEmployeesForShift: IEmployee[] = [e1, e2, e3, e4];
    expect(dTB.employees).toEqual(expectedEmployeesForShift);
  });

  it('should throw Error if it has sector duplicates', () => {
    let sectorsWithDuplicate: ISector[] = [g12r, g12p, g12r];
    expect(
      () =>
        new DefaultTableBuilder(
          sectorsWithDuplicate,
          employees,
          shiftStartTime,
          shiftEndTime,
          todayDate,
          30
        )
    ).toThrowError(
      `An array ${JSON.stringify(
        sectorsWithDuplicate
      )} has a duplicate ${JSON.stringify(g12r)}!`
    );
  });

  it('should throw Error if it has employees duplicates', () => {
    let employeesWithDuplicate: IEmployee[] = [e1, e2, e3, e1];
    expect(
      () =>
        new DefaultTableBuilder(
          sectors,
          employeesWithDuplicate,
          shiftStartTime,
          shiftEndTime,
          todayDate,
          30
        )
    ).toThrowError(
      `An array ${JSON.stringify(
        employeesWithDuplicate
      )} has a duplicate ${JSON.stringify(e1)}!`
    );
  });

  it('should throw Error if it not enough employees', () => {
    let notEnoughEmployees: IEmployee[] = [e1, e2];
    expect(
      () =>
        new DefaultTableBuilder(
          sectors,
          notEnoughEmployees,
          shiftStartTime,
          shiftEndTime,
          todayDate,
          30
        )
    ).toThrowError(
      `Not enough people for work! Coefficient : ${
        notEnoughEmployees.length / sectors.length
      }`
    );
  });

  it('should throw Error if not all employees can work at least on one sector', () => {
    let e5: IEmployee = {
      id: 100,
      name: 'Test',
      totalTime: 0,
      sectorPermits: [{ name: 'T1' }],
      color: 'black',
    };
    let employeesWithOneWhoCantWork: IEmployee[] = [e1, e2, e3, e5];
    expect(
      () =>
        new DefaultTableBuilder(
          sectors,
          employeesWithOneWhoCantWork,
          shiftStartTime,
          shiftEndTime,
          todayDate,
          30
        )
    ).toThrowError(
      `Employee ${e5.name} cannot work \n ${e5.name}'s permits: ${
        e5.sectorPermits[0].name
      } \n Needed permits: ${[g12r.name, g12p.name]}`
    );
  });
});
