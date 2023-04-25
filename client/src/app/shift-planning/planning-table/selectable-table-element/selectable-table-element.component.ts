import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';
import { ISector } from 'src/app/models/ISector';
import { IWorkAndRestTimeInfo } from 'src/app/models/ITimeOfWorkInfo';
import { EmployeeSetterService } from 'src/app/Services/EmployeeSetterService/employee-setter.service';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';


//Target: to display available employees for selection
//Get the full array of employees
//Get the sector
//filter employees by sector and by time (who can work)
//display employees 


//When mouse over - showBorder and showSelector set to true
//If selector is clicked set selectorIsActive to true
//Either showSelector or selectorIsActive are true - show selector
@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber!: number;
  @Input() columnNumber!: number;
  @Input() sector!: ISector;

  public ifShowSelector: boolean = false;
  public ifSelectorActive: boolean = false;
  public ifShowBorder: boolean = false;
  public ifSelected: boolean = false;


  public employeesToSelectFrom: IEmployee[] = [];
  public employee: IEmployee | undefined;
  public color: string | undefined;

  public timeInfo: IWorkAndRestTimeInfo | undefined;

  constructor(private planningTableService: TablesBuilderService, private employeeSetterService: EmployeeSetterService) {
  }


  ngOnInit(): void {

    this.configureProperEmployees();
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
    if (this.employee) {
      this.color = this.employee?.color;
      this.timeInfo = this.planningTableService.getWorkAndRestTimeInfo(this.employee!, this.rowNumber!);
    }
  }



  toggleShowBorderAndSelector() {
    this.ifShowBorder = !this.ifShowBorder;
    this.ifShowSelector = !this.ifShowSelector;
  }

  public toggleIfSelectorActive() {
    this.ifSelectorActive = !this.ifSelectorActive;
  }

  //When we select an employee from a list
  onSelection($event: MatOptionSelectionChange) {
    this.toggleIfSelectorActive();
    this.planningTableService.setEmployeeInRow($event.source.value, this.rowNumber!, this.columnNumber);
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
  }

  configureProperEmployees() {
    this.employeesToSelectFrom = this.planningTableService.getEmployeesForSelection(this.rowNumber, this.sector);
  }
}
