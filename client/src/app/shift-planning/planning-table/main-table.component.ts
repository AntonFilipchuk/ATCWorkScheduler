import {
  Component,
  OnInit,
} from '@angular/core';
import {  MatTableDataSource } from '@angular/material/table';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';
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

  constructor(private planningTableService: TablesBuilderService) {}

  ngOnInit(): void {
    let pTS: TablesBuilderService = this.planningTableService;
    this.displayedColumns = pTS.displayColumns;
    this.sectorsForShift = pTS.sectors;

    this.tableDataSource.data = this.planningTableService.tableForMatTable;
    this.employees = pTS.employees;
  }
}
