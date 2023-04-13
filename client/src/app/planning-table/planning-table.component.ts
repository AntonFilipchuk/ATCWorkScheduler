import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
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
export class PlanningTableComponent implements OnInit, AfterViewInit {

  time: number[] = [];
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];

  tableDataSource: MatTableDataSource<ITableRow> = new MatTableDataSource<ITableRow>();

  @ViewChild(MatTable) table!: MatTable<ITableRow>;
  constructor(private planningTableService: PlanningTableService) {

  }
  ngAfterViewInit(): void {
    console.log(this.table);
  }

  ngOnInit(): void {

    let pTS = this.planningTableService;
    this.displayedColumns = ['time', ...pTS.getSectors()];

    this.sectorNames = [...pTS.getSectors()];

    this.getTableWithSubscription();
  }

  getTableWithSubscription() {
    this.planningTableService.getTableForSubscription().subscribe(
      {
        next: (response: ITableRow[]) => {
          this.tableDataSource.data = response;
        },
        error: (e: any) => {
          console.log(e);
        }
      }
    );
  }

}