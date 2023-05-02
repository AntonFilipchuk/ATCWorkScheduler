import { IEmployee } from '../models/IEmployee';

export class ObjectsComparisonHelper
{
  public ifTwoObjectsAreEqual(firstObject: any, secondObject: any): boolean
  {
    return JSON.stringify(firstObject) == JSON.stringify(secondObject);
  }

  public ifIdOfEmployeesEqual(
    e1: IEmployee | undefined,
    e2: IEmployee | undefined
  )
  {
    return e1 && e2 ? e1.id === e2.id : false;
  }

  public ifEmployeesRowHasEmployee(
    employeesRow: (IEmployee | undefined)[],
    employee: IEmployee | undefined
  )
  {
    return employee ? employeesRow.some((e) => this.ifIdOfEmployeesEqual(e, employee)) : false;
  }

  public ifArrayHasAnObject(array: any[], obj: any): boolean
  {
    return array.filter((o) => this.ifTwoObjectsAreEqual(o, obj)).length > 0;
  }
}
