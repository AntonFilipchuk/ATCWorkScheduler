import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';


export interface ITableRow {
  [key: string]: any;
}


@Component({
  selector: 'app-main-table',
  styleUrls: ['./main-table.component.scss'],
  templateUrl: './main-table.component.html',
})
export class MainTableComponent implements OnInit, AfterViewInit {
  sectorNames: string[] = [];
  displayedColumns: string[] = [];
  employees: IEmployee[] = [];

  tableDataSource: MatTableDataSource<ITableRow> = new MatTableDataSource<ITableRow>();

  @ViewChild(MatTable) table!: MatTable<ITableRow>;
  constructor(private planningTableService: TablesBuilderService) {

  }
  ngAfterViewInit(): void {
    console.log(this.table);
  }

  ngOnInit(): void {

    let pTS = this.planningTableService;
    this.displayedColumns = pTS.displayColumns;
    this.sectorNames = ['G12R', 'G12P'];

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