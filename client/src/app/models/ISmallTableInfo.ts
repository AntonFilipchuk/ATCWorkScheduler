import { ISmallTableRow } from "./ISmallTableRow";

export interface ISmallTableInfo
{
  sectors : string;
  employeeId : number;
  employeeName: string;
  table: ISmallTableRow[];
}