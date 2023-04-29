import { IEmployee } from '../models/IEmployee';
import { ISector } from '../models/ISector';
import { IWorkAndRestTimeInfo } from '../models/IWorkAndRestTimeInfo';
import { EmployeesWhoCanWorkEvaluator } from './EmployeesWhoCanWorkEvaluator';
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
describe('EmployeesWhoCanWorkEvaluator', () => {
  describe('getWorkAndRestTimeInfo', () => {
    let timeIntervalInMinutes: number = 10;

    let eWKWE: EmployeesWhoCanWorkEvaluator =
      new EmployeesWhoCanWorkEvaluator();
    it('If the employee has no worked yet', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 0,
        totalRestTimeInMinutes: 40,
        lastWorkTimeInMinutes: 0,
        lastRestTimeInMinutes: 20,
        currentWorkTimeInMinutes: 0,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          0,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });
    it('Get info for employee at the beginning', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, e2], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 10,
        totalRestTimeInMinutes: 30,
        lastWorkTimeInMinutes: 0,
        lastRestTimeInMinutes: 20,
        currentWorkTimeInMinutes: 10,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          0,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee who works right after', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, e2],
        [e1, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 20,
        totalRestTimeInMinutes: 20,
        lastWorkTimeInMinutes: 0,
        lastRestTimeInMinutes: 20,
        currentWorkTimeInMinutes: 20,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          1,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee who works 120 mins, starts at the end and has last rest 20 minutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined], // <-- check here
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 120,
        totalRestTimeInMinutes: 0,
        lastWorkTimeInMinutes: 0,
        lastRestTimeInMinutes: 20,
        currentWorkTimeInMinutes: 120,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          11,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee who works 120 mins, starts after another work session and has last rest 30 minutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined], // <-- check here
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 130,
        totalRestTimeInMinutes: 30,
        lastWorkTimeInMinutes: 10,
        lastRestTimeInMinutes: 30,
        currentWorkTimeInMinutes: 120,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          15,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee next row after the employee who works 120 mins, starts after another work session and has last rest 30 minutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here
        [undefined, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 130,
        totalRestTimeInMinutes: 50,
        lastWorkTimeInMinutes: 10,
        lastRestTimeInMinutes: 30,
        currentWorkTimeInMinutes: 120,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          16,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee next row after the employee who works 120 mins, starts after another work session and has last rest 30 minutes. And before next work session that goes until the end', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 170,
        totalRestTimeInMinutes: 50,
        lastWorkTimeInMinutes: 10,
        lastRestTimeInMinutes: 30,
        currentWorkTimeInMinutes: 120,
        nextWorkTimeInMinutes: 40,
        nextRestTimeInMinutes: 10,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          16,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee at the end of work', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined], // <-- check here
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 170,
        totalRestTimeInMinutes: 50,
        lastWorkTimeInMinutes: 120,
        lastRestTimeInMinutes: 20,
        currentWorkTimeInMinutes: 40,
        nextWorkTimeInMinutes: 0,
        nextRestTimeInMinutes: 20,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          21,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });

    it('Get info for the employee that works between', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, e2],
        [undefined, undefined],
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [e1, undefined],
        [undefined, undefined],
      ];
      let expectedWorkAndRestTimeInfo: IWorkAndRestTimeInfo = {
        totalWorkingTimeInMinutes: 20,
        totalRestTimeInMinutes: 40,
        lastWorkTimeInMinutes: 10,
        lastRestTimeInMinutes: 10,
        currentWorkTimeInMinutes: 0,
        nextWorkTimeInMinutes: 10,
        nextRestTimeInMinutes: 10,
      };
      expect(
        eWKWE.getWorkAndRestTimeInfo(
          e1,
          2,
          employeesTableAs2DArray,
          timeIntervalInMinutes
        )
      ).toEqual(expectedWorkAndRestTimeInfo);
    });
  });

  describe('getEmployeesWhoCanWork', () => {
    let employees: IEmployee[] = [e1, e2, e3, e4];
    let firstMaxWorkTimeInMinutes: number = 60;
    let secondMaxWorkTimeInMinutes: number = 120;
    let firstMinRestTimeInMinutes: number = 10;
    let secondMinRestTimeInMinutes: number = 20;
    let sector: ISector = g12r;
    let eWKWE: EmployeesWhoCanWorkEvaluator =
      new EmployeesWhoCanWorkEvaluator();
    it('Every employee should be available at the start of work', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          0,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual(employees);
    });

    it('Every employee should be available at the end of work', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          3,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual(employees);
    });

    it('Every employee should be available in the middle of day', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          1,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual(employees);
    });

    it('Exclude an employee if he already works', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, e1], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          0,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });

    it('Exclude an employee if he has worked more then secondMaxWorkTimeInMinutes and is added to the bottom of work session', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          12,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });


    it('Exclude an employee if he has worked more then secondMaxWorkTimeInMinutes in previous work session and last rest time is less then secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], 
        [undefined, undefined], // <-- check here
        [undefined, undefined],
        [undefined, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          13,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });

    it('Exclude an employee if he has worked more then secondMaxWorkTimeInMinutes and is added to the top of work session', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], // <-- check here
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          3,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });

    it('Exclude an employee if he has worked more then secondMaxWorkTimeInMinutes in next work session and next rest time is less then secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], // <-- check here
        [undefined, undefined], 
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          2,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });

    it('Employee is available if he is added to the top of work session and current work time is less then secondMaxWorkTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], // <-- check here
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          3,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e1, e2, e3, e4]);
    });

    it('Employee is available if he is added to the bottom of work session and current work time is less then secondMaxWorkTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here (11)
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], 
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          11,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e1, e2, e3, e4]);
    });

    it('Employee is available if he is added to the bottom of work session and current work time is less then secondMaxWorkTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here (11)
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], 
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          11,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e1, e2, e3, e4]);
    });


    it('Employee is excluded if he is added to the bottom of work session, but next work session is equal to secondMaxWorkTimeInMinutes and next rest time is equal to secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here (6)
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],        
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          6,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e2, e3, e4]);
    });
    it('Employee is available if he is added to the bottom of work session, next work session is equal to secondMaxWorkTimeInMinutes and next rest time is greater then secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined], // <-- check here (11)
        [undefined, undefined],
        [undefined, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],        
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          6,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([e1, e2, e3, e4]);
    });

    it('Employee is excluded if he is added to the top of work session, but last work session is equal to secondMaxWorkTimeInMinutes and last rest time is less than secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],        
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined], // <-- check here (13)
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          13,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([ e2, e3, e4]);
    });

    it('Employee is available if he is added to the top of work session, next work session is equal to secondMaxWorkTimeInMinutes and current rest time is equal to secondMinRestTimeInMinutes', () => {
      let employeesTableAs2DArray: (IEmployee | undefined)[][] = [
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],        
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined], // <-- check here (13)
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
        [e1, undefined],
      ];

      expect(
        eWKWE.getEmployeesWhoCanWork(
          employees,
          14,
          employeesTableAs2DArray,
          firstMaxWorkTimeInMinutes,
          secondMaxWorkTimeInMinutes,
          firstMinRestTimeInMinutes,
          secondMinRestTimeInMinutes,
          10,
          sector
        )
      ).toEqual([ e1, e2, e3, e4]);
    });
  });
});
