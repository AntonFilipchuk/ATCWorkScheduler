import { Injectable } from '@angular/core';
import { IEmployee } from '../models/IEmployee';

let e1: IEmployee = {
  id: 1,
  name: 'Anton',
  totalTime: 0
}

let e2: IEmployee = {
  id: 2,
  name: 'John',
  totalTime: 0
}

let e3: IEmployee = {
  id: 3,
  name: 'Mary',
  totalTime: 0
}

let e4: IEmployee = {
  id: 4,
  name: 'Jane',
  totalTime: 0
}

@Injectable({
  providedIn: 'root'
})
export class PlanningTableService {

  constructor() { }

  getAvailableEmployees(): IEmployee[] {
    return [e1, e2, e3, e4];
  }

  getTimeIntervals(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  getSectors(): string[] {
    return ['G12R', 'G12P'];
  }
}
