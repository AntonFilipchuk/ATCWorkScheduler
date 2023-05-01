import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';
import { ISector } from 'src/app/models/ISector';

export interface ITableRow {
  [key: string]: any;
}

@Component({
  selector: 'app-main-table',
  styleUrls: ['./main-table.component.scss'],
  templateUrl: './main-table.component.html',
})
export class MainTableComponent implements OnInit {
  public sectorsForShift: ISector[] = [];
  public displayedColumns: string[] = [];
  public employees: IEmployee[] = [];

  public tableDataSource: MatTableDataSource<ITableRow> =
    new MatTableDataSource<ITableRow>();

  public selectedColumnNumber: number = -1;

  public availableRows: number[] = [];

  public selectedEmployeeToSet: IEmployee | undefined;

  public ifSelectionActive: boolean = false;

  constructor(private planningTableService: TablesBuilderService) {}

  ngOnInit(): void {
    let pTS = this.planningTableService;
    this.displayedColumns = pTS.displayColumns;
    this.sectorsForShift = pTS.sectors;

    this.getTableForSubscription();
    this.employees = pTS.employees;
  }

  public changeIfSelectionActive(state: boolean) {
    this.ifSelectionActive = state;
  }

  public changeSelectedEmployeeToSet(employee: IEmployee) {
    this.selectedEmployeeToSet = employee;
    console.log('Selected Employee to set changed', employee.name);
  }

  public changeSelectedColumn(columnNumber: number) {
    this.selectedColumnNumber = columnNumber;
    console.log('Selected column changed', this.selectedColumnNumber);
  }

  public changeAvailableRows(availableRows: number[]) {
    this.availableRows = availableRows;
    console.log('AvailableRows Changed', this.availableRows);
  }

  getTableForSubscription() {
    this.planningTableService.getTableForSubscription().subscribe({
      next: (response: ITableRow[]) => {
        this.tableDataSource.data = response;
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }
}
