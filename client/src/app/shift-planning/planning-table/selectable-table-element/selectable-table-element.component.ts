import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';
import { ISector } from 'src/app/models/ISector';
import { IWorkAndRestTimeInfo } from 'src/app/models/IWorkAndRestTimeInfo';
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
export class SelectableTableElementComponent implements OnInit, OnChanges {

  @Input() rowNumber!: number;
  @Input() columnNumber!: number;
  @Input() sector!: ISector;


  @Input() selectedColumnNumber!: number;
  @Output() selectedColumnNumberChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() employeeChange: EventEmitter<IEmployee | undefined> = new EventEmitter<IEmployee | undefined>();

  public ifShowSelector: boolean = false;
  public ifSelectorActive: boolean = false;
  public ifShowBorder: boolean = false;
  public ifSelected: boolean = false;
  public ifCellDisabled: boolean = false;


  public employeesToSelectFrom: IEmployee[] = [];
  public employee: IEmployee | undefined;
  public color: string | undefined;
  public timeInfo: IWorkAndRestTimeInfo | undefined;

  //1) Click on cell
  //2) Deactivate all columns except the one that was selected
  //3) Select an employee
  //4) Color all cells where the employee may be put
  //5) Until the LMB is not pressed again - allow to select cells

  constructor(private planningTableService: TablesBuilderService) {
  }
  ngOnChanges(): void {
    
    if (this.selectedColumnNumber >= 0 && this.columnNumber !== this.selectedColumnNumber) {
      this.color = 'lightGrey';
      this.ifCellDisabled = true;
    }
    else if (this.employee) {
      console.log('Employee');
      
      this.color = this.employee?.color;
      this.timeInfo = this.planningTableService.getWorkAndRestTimeInfo(this.employee!, this.rowNumber!);
    }
    else {
      this.color = 'grey';
      this.ifCellDisabled = false;
    }
  }

  ngOnInit(): void {
    this.configureProperEmployees();
    
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
    this.changeSelectedColumn();
  }

  public toggleOnSelectorClose() {
    //console.log("Closed!");
    this.ifSelectorActive = !this.ifSelectorActive;
    this.changeToDefault();
  }

  //When we select an employee from the list
  onSelection($event: MatOptionSelectionChange) {
    this.changeToDefault();
    //this.toggleIfSelectorActive();
    let selectedEmployee = $event.source.value;
    this.planningTableService.setEmployeeInRow(selectedEmployee, this.rowNumber!, this.columnNumber);
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
  }

  changeSelectedColumn() {
    //console.log('Change column to', this.columnNumber)
    this.selectedColumnNumberChange.emit(this.columnNumber);
  }

  changeToDefault() {
    //console.log('To default');
    this.selectedColumnNumberChange.emit(-1);
  }

  configureProperEmployees() {
    this.employeesToSelectFrom = this.planningTableService.getEmployeesForSelection(this.rowNumber, this.sector);
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(this.rowNumber, this.columnNumber);
  }
}
