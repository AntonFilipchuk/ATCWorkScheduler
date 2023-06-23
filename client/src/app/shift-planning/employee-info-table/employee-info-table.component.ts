import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';
import { ISector } from 'src/app/models/ISector';
import { ISmallTableInfo } from 'src/app/models/ISmallTableInfo';
import { ISmallTableRow } from 'src/app/models/ISmallTableRow';


@Component({
  selector: 'app-employee-info-table',
  templateUrl: './employee-info-table.component.html',
  styleUrls: ['./employee-info-table.component.scss']
})
export class EmployeeInfoTableComponent implements OnInit
{
  @Input() employee!: IEmployee;

  public color: string = 'grey';
  public totalWorkTime: string = '';
  public totalRestTime: number = 0;
  public displayedColumns: string[] = [];

  public selectedStartTimeInterval: Date[] | undefined;
  public selectedEndTimeInterval: Date[] | undefined;

  public selectedSectorToSetEmployee: ISector | undefined = { name: 'G12R' };

  //Logic to add time from table
  public selectedSector: ISector | undefined;
  public ifShowSectorSelector: boolean = false;
  public ifSectorIsSelected: boolean = false;
  public ifFirstTimeSelected: boolean = false;
  public ifSecondTimeSelected: boolean = false;
  public ifButtonActive: boolean = false;
  public ifShowStartTimeSelector: boolean = false;

  public availableStartTimeIntervals: Date[][] = [];
  public availableEndTimeIntervals: Date[][] = [];
  public table: MatTableDataSource<ISmallTableRow> =
    new MatTableDataSource<ISmallTableRow>();;
  constructor (private tablesBuilderService: TablesBuilderService) { }

  ngOnInit(): void
  {
    this.color = this.employee.color;
    this.tablesBuilderService.getSmallTablesObservable().subscribe(
      {
        next: (tablesInfo: ISmallTableInfo[]) =>
        {
          let smallTableInfo = tablesInfo.find((t) => t.employeeId === this.employee.id)!;
          let smallTable = smallTableInfo.table;
          this.table.data = smallTable;

          this.getWorkTime(smallTable);
          this.displayedColumns = [this.employee.name, smallTableInfo.sectors ? smallTableInfo.sectors : "N/A"];
        }
      }
    );
  }

  private getWorkTime(table: ISmallTableRow[])
  {
    let workTimeForSessions: number[] = [];
    for (let i = 0; i < table.length; i++)
    {
      const row = table[i];
      workTimeForSessions.push((row.timeIntervalAsDate[1].getTime() - row.timeIntervalAsDate[0].getTime()) / 60000);
    }
    let totalWorkTimeInMinutes = workTimeForSessions.reduce((partialSum, a) => partialSum + a, 0);
    if (totalWorkTimeInMinutes >= 60)
    {
      this.totalWorkTime = this.minutesToHoursAndMinutes(totalWorkTimeInMinutes);
    }
    else
    {
      this.totalWorkTime = `${totalWorkTimeInMinutes} minutes`;
    }
  }

  private minutesToHoursAndMinutes(totalMinutes: number): string
  {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes === 0 ? '00' : minutes}`;
  }

  public toggleIfButtonActive()
  {
    this.ifButtonActive = !this.ifButtonActive;
  }

  public deleteWorkSession(timeStartRowNumber: number, timeEndRowNumber: number, sectorName: string)
  {
    this.ifButtonActive = false;
    this.tablesBuilderService.deleteWorkSession(timeStartRowNumber, timeEndRowNumber, sectorName);
  }

  public addWorkSession()
  {
    this.tablesBuilderService.addWorkSession(this.selectedStartTimeInterval, this.selectedEndTimeInterval, this.selectedSector?.name!, this.employee);
    this.cancelTimeSelection();
  }

  public showStartTimeSelector()
  {
    this.ifShowStartTimeSelector = true;
  }

  public cancelTimeSelection()
  {
    this.ifShowStartTimeSelector = false;
    this.ifFirstTimeSelected = false;
    this.ifShowSectorSelector = false;
    this.ifSecondTimeSelected = false;
    this.ifSectorIsSelected = false;
  }

  public getAvailableStartTimeIntervals()
  {
    console.log("Trying to select start time");

    this.availableStartTimeIntervals = this.tablesBuilderService.getAvailableStartTimeIntervals(this.employee);
  }

  public getAvailableEndTimeIntervals()
  {
    console.log("Trying to select end time");
    this.availableEndTimeIntervals =
      this.tablesBuilderService.
        getAvailableEndTimeIntervals(this.employee, this.selectedStartTimeInterval!, this.selectedSectorToSetEmployee!);
  }
}
