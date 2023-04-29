import { IEmployee } from '../models/IEmployee';
import { ObjectsComparisonHelper } from './ObjectsComparisonHelper';

describe('ObjectsComparisonHelper', () => {
  let helper: ObjectsComparisonHelper;

  beforeEach(() => {
    helper = new ObjectsComparisonHelper();
  });

  describe('ifTwoObjectsAreEqual', () => {
    it('should return true if two objects are equal', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'John', age: 30 };
      expect(helper.ifTwoObjectsAreEqual(obj1, obj2)).toBe(true);
    });

    it('should return false if two objects are not equal', () => {
      const obj1 = { name: 'John', age: 30 };
      const obj2 = { name: 'Jane', age: 25 };
      expect(helper.ifTwoObjectsAreEqual(obj1, obj2)).toBe(false);
    });
  });

  let e1: IEmployee = {
    id: 1,
    name: 'John',
    color: 'white',
    sectorPermits: [{ name: 'G12' }],
    totalTime: 0,
  };
  let e2: IEmployee = {
    id: 2,
    name: 'Jane',
    color: 'yellow',
    sectorPermits: [{ name: 'G12' }],
    totalTime: 0,
  };

  describe('ifIdOfEmployeesEqual', () => {
    it('should return true if the IDs of two employees are equal', () => {
      const e2: IEmployee = {
        id: 1,
        name: 'Jane',
        color: 'white',
        sectorPermits: [{ name: 'G12' }],
        totalTime: 0,
      };
      expect(helper.ifIdOfEmployeesEqual(e1, e2)).toBe(true);
    });

    it('should return false if the IDs of two employees are not equal', () => {
      expect(helper.ifIdOfEmployeesEqual(e1, e2)).toBe(false);
    });

    it('should return false if one of the employees is undefined', () => {
      const e2 = undefined;
      expect(helper.ifIdOfEmployeesEqual(e1, e2)).toBe(false);
    });
  });

  describe('ifEmployeesRowHasEmployee', () => {
    it('should return true if the employees row has the employee', () => {
      const employeesRow = [e1, e2, undefined];
      const employee = {
        id: 2,
        name: 'Jane',
        color: 'yellow',
        sectorPermits: [{ name: 'G12' }],
        totalTime: 0,
      };
      expect(helper.ifEmployeesRowHasEmployee(employeesRow, employee)).toBe(
        true
      );
    });

    it('should return false if the employees row does not have the employee', () => {
      const employeesRow = [e1, e2, undefined];
      const employee = {
        id: 3,
        name: 'Jack',
        color: 'white',
        sectorPermits: [{ name: 'G12' }],
        totalTime: 0,
      };
      expect(helper.ifEmployeesRowHasEmployee(employeesRow, employee)).toBe(
        false
      );
    });

    it('should return false if the employee is undefined', () => {
      const employeesRow = [
        e1,
        e2,
        undefined,
      ];
      const employee = undefined;
      expect(helper.ifEmployeesRowHasEmployee(employeesRow, employee)).toBe(
        false
      );
    });
  });

  describe('ifArrayHasAnObject', () => {
    it('should return true if the array has the object', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        undefined,
      ];
      const obj = { id: 2, name: 'Jane' };
      expect(helper.ifArrayHasAnObject(array, obj)).toBe(true);
    });

    it('should return false if the array does not have the object', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        undefined,
      ];
      const obj = { id: 3, name: 'Jack' };
      expect(helper.ifArrayHasAnObject(array, obj)).toBe(false);
    });
  });
});
