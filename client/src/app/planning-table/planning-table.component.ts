import { Component, OnInit } from '@angular/core';
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

let defaultEmployee: IEmployee = { id: undefined, name: undefined, totalTime: undefined }

export interface employeeTableCell extends Record<string, IEmployee | number> {
}


let time: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let sectors: string[] = ['G12R', 'G12P'];

@Component({
  selector: 'app-planning-table',
  styleUrls: ['./planning-table.component.scss'],
  templateUrl: './planning-table.component.html',
})
export class PlanningTableComponent implements OnInit {
  dataSource: employeeTableCell[] = [];
  sectorNames: string[] = [];
  displayedColumns: string[] = ['Time', ...sectors];

  employees: IEmployee[] = [];

  ngOnInit(): void {
    this.dataSource = this.buildDefaultEmployeeTable(time, sectors);
    this.employees.push(e1, e2, e3, e4);
  }

  buildDefaultEmployeeTable(time: number[], sectors: string[]): employeeTableCell[] {
    let table: employeeTableCell[] = [];
    this.sectorNames = sectors;

    time.forEach(timePeriod => {
      let row: employeeTableCell = {};
      row["time"] = timePeriod;
      sectors.forEach(sector => {
        row[sector] = defaultEmployee;
      });
      table.push(row);
    });

    return table;
  }

  setEmployee()
  {
    
  }
}