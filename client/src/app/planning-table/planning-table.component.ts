import { Component, OnInit, ViewChild } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { PlanningTableService } from './planning-table.service';
import { MatTable } from '@angular/material/table';



let defaultEmployee: IEmployee = { id: undefined, name: undefined, totalTime: undefined }

export interface ITableRow extends Record<string, IEmployee | number> {
}

@Component({
  selector: 'app-planning-table',
  styleUrls: ['./planning-table.component.scss'],
  templateUrl: './planning-table.component.html',
})
export class PlanningTableComponent implements OnInit {
  time: number[] = [];
  
  sectors: string[] = [];
  dataSource: ITableRow[] = [];
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private planningTableService: PlanningTableService) {
  }

  ngOnInit(): void {
    this.time = this.planningTableService.getTimeIntervals();
    this.sectors = this.planningTableService.getSectors();
    this.displayedColumns = ['Time', ...this.sectors];
    this.dataSource = this.buildDefaultEmployeeTable(this.time, this.sectors);
    this.employees = this.planningTableService.getAvailableEmployees();
    this.setAndCheckEmployee(this.employees[0], 0, 0);
  }

  buildDefaultEmployeeTable(time: number[], sectors: string[]): ITableRow[] {
    let table: ITableRow[] = [];
    this.sectorNames = sectors;

    time.forEach(timePeriod => {
      let row: ITableRow = {};
      row["time"] = timePeriod;
      sectors.forEach(sector => {
        row[sector] = defaultEmployee;
      });
      table.push(row);
    });
    return table;
  }

  setAndCheckEmployee(employee: IEmployee, rowNumber: number, columnNumber: number) {
    let employees = this.dataSource.map(({ time, ...employees }) => employees);
    let employeeToChange = employees[rowNumber][columnNumber];

  }
}