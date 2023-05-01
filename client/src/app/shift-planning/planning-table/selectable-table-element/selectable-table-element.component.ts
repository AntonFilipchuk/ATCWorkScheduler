import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  styleUrls: ['./selectable-table-element.component.scss'],
})
export class SelectableTableElementComponent implements OnInit, OnChanges {
  @Input() rowNumber!: number;
  @Input() columnNumber!: number;
  @Input() sector!: ISector;

  //
  private _selectedEmployee: IEmployee | undefined;
  //

  public ifEmployeeWhoWasChosenShouldBeSet: boolean = false;

  public ifShowSelector: boolean = false;
  public ifSelectorActive: boolean = false;
  public ifShowBorder: boolean = false;
  public ifSelected: boolean = false;
  public ifCellDisabled: boolean = false;

  public employeesForSelection: IEmployee[] = [];
  public employee: IEmployee | undefined;
  public color: string = 'grey';
  public timeInfo: IWorkAndRestTimeInfo | undefined;

  //1) Click on cell
  //2) Deactivate all columns except the one that was selected
  //3) Select an employee
  //4) Color all cells where the employee may be put
  //5) Until the LMB is not pressed again - allow to select cells

  //1) When mouse in not over cell - no border and selector
  //2) When mouse in over cell - show border and selector
  //3) When selector is clicked - deactivate other columns
  //4) When employee is selected - keep other columns deactivated,
  //  change status to selection is active,
  //  if other cells are available for selection - change border color.
  //5) when mouse enters where employee can be selected - set employee
  //6) if employee is set and mouse is clicked - make other columns active again

  constructor(private planningTableService: TablesBuilderService) {}
  ngOnChanges(changes: SimpleChanges): void {
    //console.log('OnChanges');
    // this.setEmployeeColor();
  }
  ngOnInit(): void {
    //console.log('OnInit');
    this.getColumnNumberWhereSelectionIsActive();
    this.getEmployeeWhoWasChosenForSelection();
    this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(
      this.rowNumber,
      this.columnNumber
    );

    this.setEmployeeColor();
  }

  private getEmployeeWhoWasChosenForSelection() {
    this.planningTableService.getEmployeeWhoWasChosenForSelection().subscribe({
      next: (employee: IEmployee | undefined) => {
        this._selectedEmployee = employee;
        this.checkIfEmployeeWhoWasChosenShouldBeSet(employee);
      },
      error: (e) => {
        console.log('Could not get an employee who was chosen for selection');
      },
    });
  }

  private getColumnNumberWhereSelectionIsActive() {
    this.planningTableService
      .getColumnNumberWhereSelectionIsActiveForSubscription()
      .subscribe({
        next: (columnNumber: number) => {
          this.checkIfCellShouldBeActive(columnNumber);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  private checkIfEmployeeWhoWasChosenShouldBeSet(
    employee: IEmployee | undefined
  ) {
    if (employee) {
      this.ifEmployeeWhoWasChosenShouldBeSet = true;
    } else {
      this.ifEmployeeWhoWasChosenShouldBeSet = false;
    }
  }

  private checkIfCellShouldBeActive(columnNumber: number) {
    this.ifCellDisabled =
      this.columnNumber !== columnNumber && columnNumber >= 0;
    if (this.employee) {
      this.color = this.employee.color;
    } else if (this.ifCellDisabled) {
      this.color = 'lightgrey';
    } else {
      this.color = 'grey';
    }
  }

  private setColumnNumberWhereSelectionIsActive() {
    this.planningTableService.setColumnNumberWhereSelectionIsActive(
      this.columnNumber
    );
  }

  public getEmployeesForSelection() {
    this.employeesForSelection =
      this.planningTableService.getEmployeesForSelection(
        this.rowNumber,
        this.sector
      );
  }

  public setSelectedEmployee() {
    if (this._selectedEmployee) {
      if (this.employee?.id === this._selectedEmployee.id) {
        return;
      } else if (
        this.planningTableService
          .getEmployeesForSelection(this.rowNumber, this.sector)
          .includes(this._selectedEmployee)
      ) {
        this.planningTableService.setEmployeeInRow(
          this._selectedEmployee,
          this.rowNumber,
          this.columnNumber
        );
      }
    }
  }

  public onSelection(employee: IEmployee) {
    this.planningTableService.setEmployeeWhoWasChosenForSelection(employee);
    this.planningTableService.setEmployeeInRow(
      employee,
      this.rowNumber,
      this.columnNumber
    );
  }

  private setEmployeeColor() {
    if (this.employee) {
      this.color = this.employee.color;
    }
  }

  public disableSelectionOfSelectedEmployee()
  {
    this.planningTableService.setEmployeeWhoWasChosenForSelection(undefined);
    this.onSelectorClose();
    this.selectionNotActive();
  }
  public toggleBorderAndSelectorVisibility() {
    this.ifShowBorder = !this.ifShowBorder;
    this.ifShowSelector = !this.ifShowSelector;
  }

  private resetColumnNumberWhereSelectionIsActive() {
    this.planningTableService.setColumnNumberWhereSelectionIsActive(-1);
  }

  public onSelectorClose() {
    this.resetColumnNumberWhereSelectionIsActive();
  }

  public selectionActive() {
    this.ifSelectorActive = !this.ifSelectorActive;
    this.setColumnNumberWhereSelectionIsActive();
  }

  public selectionNotActive() {
    this.ifSelectorActive = !this.ifSelectorActive;
  }

  // ngOnChanges(): void {
  //   if (this.availableRows.includes(this.rowNumber)) {
  //     this.color = 'orange';
  //   } else if (
  //     this.selectedColumnNumber >= 0 &&
  //     this.columnNumber !== this.selectedColumnNumber
  //   ) {
  //     this.color = 'lightGrey';
  //     this.ifCellDisabled = true;
  //   } else if (this.employee) {
  //     this.color = this.employee?.color;
  //     this.timeInfo = this.planningTableService.getWorkAndRestTimeInfo(
  //       this.employee!,
  //       this.rowNumber!
  //     );
  //   } else {
  //     this.color = 'grey';
  //     this.ifCellDisabled = false;
  //   }
  // }

  // ngOnInit(): void {
  //   this.configureProperEmployees();

  //   if (this.employee) {
  //     this.color = this.employee?.color;
  //     this.timeInfo = this.planningTableService.getWorkAndRestTimeInfo(
  //       this.employee!,
  //       this.rowNumber!
  //     );
  //   }
  // }

  // toggleShowBorderAndSelector() {
  //   this.ifShowBorder = !this.ifShowBorder;
  //   this.ifShowSelector = !this.ifShowSelector;
  // }

  // public toggleIfSelectorActive() {
  //   this.ifSelectorActive = !this.ifSelectorActive;
  //   this.changeSelectedColumn();
  // }

  // public toggleOnSelectorClose() {
  //   //console.log("Closed!");
  //   this.ifSelectorActive = !this.ifSelectorActive;
  //   this.changeToDefault();
  // }

  // //When we select an employee from the list
  // onSelection($event: MatOptionSelectionChange) {
  //   this.changeToDefault();
  //   //this.toggleIfSelectorActive();
  //   let selectedEmployee = $event.source.value;

  //   this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(
  //     this.rowNumber,
  //     this.columnNumber
  //   );

  //   if (selectedEmployee) {
  //     let rows = this.planningTableService.getRowsNumbers(
  //       selectedEmployee,
  //       this.rowNumber,
  //       this.columnNumber
  //     );
  //     this.availableRowsChange.emit(rows);
  //   }

  //   this.planningTableService.setEmployeeInRow(
  //     selectedEmployee,
  //     this.rowNumber!,
  //     this.columnNumber
  //   );
  // }

  // changeSelectedColumn() {
  //   //console.log('Change column to', this.columnNumber)
  //   this.selectedColumnNumberChange.emit(this.columnNumber);
  // }

  // changeToDefault() {
  //   //console.log('To default');
  //   this.selectedColumnNumberChange.emit(-1);
  // }

  // configureProperEmployees() {
  //   this.employeesToSelectFrom =
  //     this.planningTableService.getEmployeesForSelection(
  //       this.rowNumber,
  //       this.sector
  //     );
  //   this.employee = this.planningTableService.getEmployeeByRowAnColumnNumber(
  //     this.rowNumber,
  //     this.columnNumber
  //   );
  // }
}
