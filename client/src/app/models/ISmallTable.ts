import { ISmallTableRow } from "./ISmallTableRow";

export interface ISmallTable
{
  sectors : string;
  employeeId : number;
  employeeName: string;
  table: ISmallTableRow[];
}