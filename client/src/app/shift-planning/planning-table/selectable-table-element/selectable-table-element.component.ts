import
{
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
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
export class SelectableTableElementComponent implements OnInit
{
  @Input() rowNumber!: number;
  @Input() columnNumber!: number;
  @Input() sector!: ISector;

  //
  private _selectedEmployee: IEmployee | undefined;
  public selectedEmployeeRowNumber: number = -1;
  //

  public ifMouseTouchedAgainRowWhereEmployeeWasSelected: boolean = false;
  public ifEmployeeWhoWasChosenShouldBeSet: boolean = false;

  public ifShowSelector: boolean = false;
  public ifSelectorActive: boolean = false;
  public ifShowBorder: boolean = false;
  public ifCellDisabled: boolean = false;

  public employeesForSelection: IEmployee[] = [];
  public employee: IEmployee | undefined;
  public color: string = 'grey';

  constructor (private planningTableService: TablesBuilderService) { }

  ngOnInit(): void
  {

    this.getColumnNumberWhereSelectionIsActive();
    this.getEmployeeWhoWasChosenForSelection();
    this.getEmployeesAs2DTable();
    this.getRowNumberOfSelectedEmployee();
    this.getIfMouseTouchedAgainRowWhereEmployeeWasSelected();
  }

  private getEmployeesAs2DTable()
  {
    this.planningTableService.getEmployeesTableAs2DArrayForSubscription().subscribe(
      {
        next: (table: (IEmployee | undefined)[][]) => 
        {
          this.employee = table[this.rowNumber][this.columnNumber];
          this.setCellColor();
        },
        error: (e) =>
        {
          console.log(e);
          this.employee = undefined;
          this.color = 'grey';
        }
      }
    );
  }

  //Get the employee who was chosen for setting
  //Switch the state of ifEmployeeWhoWasChosenShouldBeSet
  private getEmployeeWhoWasChosenForSelection()
  {
    this.planningTableService.getEmployeeWhoWasChosenForSelectionForSubscription().subscribe({
      next: (employee: IEmployee | undefined) =>
      {
        employee ?
          this.ifEmployeeWhoWasChosenShouldBeSet = true
          : this.ifEmployeeWhoWasChosenShouldBeSet = false;

        this._selectedEmployee = employee;
      },
      error: (e) =>
      {
        console.log('Could not get an employee who was chosen for selection', e);
        this._selectedEmployee = undefined;
      },
    });
  }


  //Also check if the mouse touched the row 
  //Where the selected employee was initially selected
  private getIfMouseTouchedAgainRowWhereEmployeeWasSelected()
  {
    this.planningTableService.getIfMouseTouchedAgainRowWhereEmployeeWasSelected().subscribe(
      {
        next: (state: boolean) => 
        {
          this.ifMouseTouchedAgainRowWhereEmployeeWasSelected = state;
        },
        error: (e) => 
        {
          console.log(e);

        }
      }
    );
  }

  //Get the row number of selected employee
  //We need it to allow setting the employee 
  //Only when the mouse touches again the row
  //Where the employee was initially selected
  private getRowNumberOfSelectedEmployee()
  {
    this.planningTableService.getRowNumberOfSelectedEmployee().subscribe(
      {
        next: (rowNumber: number) => 
        {
          this.selectedEmployeeRowNumber = rowNumber;
        },
        error: (e) => 
        {
          console.log(e);
        }
      }
    );
  }

  //Get the column number where selection/setting is active
  //Deactivate other columns
  private getColumnNumberWhereSelectionIsActive()
  {
    this.planningTableService
      .getColumnNumberWhereSelectionIsActiveForSubscription()
      .subscribe({
        next: (columnNumber: number) =>
        {
          this.checkIfCellShouldBeActive(columnNumber);
        },
        error: (e) =>
        {
          console.log(e);
        },
      });
  }

  private checkIfCellShouldBeActive(columnNumber: number)
  {
    this.ifCellDisabled =
      this.columnNumber !== columnNumber && columnNumber >= 0;
    this.setCellColor();
  }


  //Called when mouse down on selector to load list of employees to chose from
  public getEmployeesForSelection()
  {
    this.employeesForSelection =
      this.planningTableService.getEmployeesForSelection(
        this.rowNumber,
        this.columnNumber,
        this.sector
      );
  }

  //Check the state if the mouse touched cell where an employee was *initially* set
  public mouseHasTouchedCellWhereEmployeeWasSelected()
  {
    if (this.rowNumber === this.selectedEmployeeRowNumber)
    {
      this.planningTableService.setIfMouseTouchedAgainRowWhereEmployeeWasSelected(true);
    }
  }

  //Called when the setting of selected employee is active
  //But before setting need to check if the mouse has touched the initial cell
  public setSelectedEmployee()
  {
    if (!this.ifMouseTouchedAgainRowWhereEmployeeWasSelected)
    {
      return;
    }

    if (this._selectedEmployee)
    {
      //If employee is already set -> skip
      if (this.employee?.id === this._selectedEmployee.id)
      {
        return;
      }

      if (
        this.planningTableService
          .getEmployeesForSelection(this.rowNumber, this.columnNumber, this.sector)
          .includes(this._selectedEmployee)
      )
      {
        this.planningTableService.setEmployeeInRow(
          this._selectedEmployee,
          this.rowNumber,
          this.columnNumber
        );
      }
    }

  }

  //Called when employee from selector list is selected
  public onSelection(employee: IEmployee)
  {
    this.ifShowBorder = false;
    this.ifSelectorActive = false;
    this.planningTableService.setEmployeeWhoWasChosenForSelection(employee);
    this.planningTableService.setRowNumberOfSelectedEmployee(this.rowNumber);
    this.planningTableService.setEmployeeInRow(
      employee,
      this.rowNumber,
      this.columnNumber
    );
  }

  //Called every time when we get a new employeesTableAs2DArray
  private setCellColor()
  {
    if (this.employee)
    {
      this.color = this.employee.color;
    }
    else if (this.ifCellDisabled)
    {
      this.color = 'lightGrey';
    }
    else
    {
      this.color = 'grey';
    }
  }

  //Called when setting of the selected employee is finished
  //Reset all values
  public disableSelectionOfSelectedEmployee()
  {
    this.planningTableService.setEmployeeWhoWasChosenForSelection(undefined);
    this.planningTableService.setRowNumberOfSelectedEmployee(-1);
    this.planningTableService.setIfMouseTouchedAgainRowWhereEmployeeWasSelected(false);
    this.onSelectorClose();
    this.selectionNotActive();
  }

  //Called every time mouse is over the cell
  public toggleBorderAndSelectorVisibility()
  {
    this.ifShowBorder = !this.ifShowBorder;
    this.ifShowSelector = !this.ifShowSelector;
  }

  //Called when selection list of employees is closed
  //If we did't choose an employee to set ->
  //Reset column where selection was active -> activate other columns
  public onSelectorClose()
  {
    if (!this.ifEmployeeWhoWasChosenShouldBeSet)
    {
      this.planningTableService.setColumnNumberWhereSelectionIsActive(-1);
    }
  }

  //Called when selector is clicked
  //Tell service that selection is active -> deactivate other columns except active 
  public selectionActive()
  {
    this.ifSelectorActive = true;
    this.planningTableService.setColumnNumberWhereSelectionIsActive(this.columnNumber);
  }

  //Called when selector is closed
  public selectionNotActive()
  {
    this.ifSelectorActive = false;
  }
}
