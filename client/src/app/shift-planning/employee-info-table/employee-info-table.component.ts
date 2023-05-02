import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';
import { ISmallTable } from 'src/app/models/ISmallTable';
import { ISmallTableRow } from 'src/app/models/ISmallTableRow';

@Component({
  selector: 'app-employee-info-table',
  templateUrl: './employee-info-table.component.html',
  styleUrls: ['./employee-info-table.component.scss']
})
export class EmployeeInfoTableComponent implements OnInit
{
  @Input() employee!: IEmployee;

  public displayedColumns: string[] = [];
  public table: MatTableDataSource<ISmallTableRow> =
  new MatTableDataSource<ISmallTableRow>();;
  constructor (private tablesBuilderService: TablesBuilderService)
  { }
  ngOnInit(): void
  {
    console.log(this.employee.name);
    
    this.tablesBuilderService.getSmallTablesObservable().subscribe(
      {
        next: (tables: ISmallTable[]) =>
        {
          let smallTable = tables.find((t) => t.employeeId === this.employee.id)!;
          this.table.data = smallTable.table;
          this.displayedColumns = [this.employee.name, smallTable.sectors ? smallTable.sectors : "N/A"]
        }
      }
    );
  }


}
