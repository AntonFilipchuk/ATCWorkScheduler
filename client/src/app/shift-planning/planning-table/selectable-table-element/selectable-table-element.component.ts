import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';
import { ISector } from 'src/app/models/ISector';
import { IWorkAndRestTimeInfo } from 'src/app/models/ITimeOfWorkInfo';


//Target: to display available employees for selection
//Get the full array of employees
//Get the sector
//filter employees by sector and by time (who can work)
//display employees 



@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit, OnChanges {

  @Input() rowNumber!: number;
  @Input() columnNumber!: number;
  @Input() sector!: ISector;

  public showSelector: boolean = false;
  public ifSelected: boolean = false;
  public showBorder: boolean = false;
  public employeesToSelectFrom: IEmployee[] = [];
  public employee: IEmployee | undefined;
  public color: string | undefined;

  public workAndRestTime: IWorkAndRestTimeInfo | undefined;
  public totalWorkTime: number = 0;
  public lastWorkTime: number = 0;
  public totalRestTime: number = 0;
  public lastRestTime: number = 0;

  private _employeesForShift: IEmployee[] = [];


  constructor(private planningTableService: TablesBuilderService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this._employeesForShift = this.planningTableService.employeesForShift;
    this.configureProperEmployees();
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
    if (this.employee) {
      this.color = this.employee?.color;
      this.workAndRestTime = this.planningTableService.getWorkAndRestTimeInfo(this.employee, this.rowNumber);
    }
  }

  getStyleForCell(): any {
    return { 'background-color': 'yellow' }
  }

  toggleShowBorder() {
    this.showBorder = !this.showBorder;
  }

  toggle() {
    if (!this.ifSelected) {
      this.showSelector = true;
    }
    else {
      this.showSelector = !this.showSelector;
      this.ifSelected = false;
    }
  }

  toggleSelection() {
    this.ifSelected = true;
    this.toggle();
  }

  onSelection($event: MatOptionSelectionChange) {
    this.toggleSelection();
    this.planningTableService.setEmployeeInRow($event.source.value, this.rowNumber!, this.columnNumber);
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
  }

  configureProperEmployees() {
    this.employeesToSelectFrom = this.planningTableService.getEmployeesForSelection(this.rowNumber, this.sector); 
    //console.log(`Row ${this.rowNumber}, Column ${this.columnNumber}, Sector ${this.sector.name}`,this.employeesToSelectFrom);
    
  }
}
