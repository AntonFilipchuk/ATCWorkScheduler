import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IEmployee } from '../models/IEmployee';
import { PlanningTableService } from './planning-table.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IEmployeesRow } from '../models/IEmployeesRow';
import { ITimeRow } from '../models/ITimeRow';



let defaultEmployee: IEmployee = { id: undefined, name: undefined, totalTime: undefined }


export interface ITableRow {
  [key: string]: any;
}


@Component({
  selector: 'app-planning-table',
  styleUrls: ['./planning-table.component.scss'],
  templateUrl: './planning-table.component.html',
})
export class PlanningTableComponent implements OnInit {

  time: number[] = [];
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];

  tableDataSource: MatTableDataSource<ITableRow> = new MatTableDataSource<ITableRow>();


  constructor(private planningTableService: PlanningTableService) {

  }

  ngOnInit(): void {

    let pTS = this.planningTableService;
    this.planningTableService.buildDefaultTable();
    this.displayedColumns = ['time', ...pTS.getSectors()];

    pTS.foo();
    this.sectorNames = [...pTS.getSectors()];
    this.tableDataSource.data = pTS.table;


  }

}