import { Injectable } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSetterService {
  public chosenEmployee: IEmployee | undefined = undefined;
  public columnNumber: number = -1;
  constructor() { }
}
