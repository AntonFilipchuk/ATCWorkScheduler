import
{
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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


  @Output() ifEmployeeWasSet: EventEmitter<void> = new EventEmitter<void>();
  //
  private _selectedEmployee: IEmployee | undefined;
  public selectedEmployeeRowNumber: number = -1;
  //

  public ifMouseTouchedAgainRowWhereEmployeeWasSelected: boolean = false;
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

  constructor (private planningTableService: TablesBuilderService) { }

  ngOnInit(): void
  {

    this.getColumnNumberWhereSelectionIsActive();
    this.getEmployeeWhoWasChosenForSelection();
    this.getEmployeesAs2DTable();
    this.getRowNumberOfSelectedEmployee();
    this.getIfMouseTouchedAgainRowWhereEmployeeWasSelected();
  }

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

  private getEmployeesAs2DTable()
  {
    this.planningTableService.getEmployeesTableAs2DArrayForSubscription().subscribe(
      {
        next: (table: (IEmployee | undefined)[][]) => 
        {
          this.employee = table[this.rowNumber][this.columnNumber];
          this.setEmployeeColor();
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

  private getEmployeeWhoWasChosenForSelection()
  {
    this.planningTableService.getEmployeeWhoWasChosenForSelectionForSubscription().subscribe({
      next: (employee: IEmployee | undefined) =>
      {
        this._selectedEmployee = employee;
        this.checkIfEmployeeWhoWasChosenShouldBeSet(employee);
      },
      error: (e) =>
      {
        console.log('Could not get an employee who was chosen for selection', e);
        this._selectedEmployee = undefined;
      },
    });
  }

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

  private checkIfEmployeeWhoWasChosenShouldBeSet(
    employee: IEmployee | undefined
  )
  {
    if (employee)
    {
      this.ifEmployeeWhoWasChosenShouldBeSet = true;
    } else
    {
      this.ifEmployeeWhoWasChosenShouldBeSet = false;
    }
  }

  private checkIfCellShouldBeActive(columnNumber: number)
  {
    this.ifCellDisabled =
      this.columnNumber !== columnNumber && columnNumber >= 0;
    if (this.employee)
    {
      this.color = this.employee.color;
    } else if (this.ifCellDisabled)
    {
      this.color = 'lightgrey';
    } else
    {
      this.color = 'grey';
    }
  }

  private setColumnNumberWhereSelectionIsActive()
  {
    this.planningTableService.setColumnNumberWhereSelectionIsActive(
      this.columnNumber
    );
  }

  public getEmployeesForSelection()
  {
    this.employeesForSelection =
      this.planningTableService.getEmployeesForSelection(
        this.rowNumber,
        this.columnNumber,
        this.sector
      );
  }

  public mouseHasTouched()
  {
    if (this.rowNumber === this.selectedEmployeeRowNumber)
    {
      console.log('Row', this.rowNumber, this.selectedEmployeeRowNumber);
      this.planningTableService.setIfMouseTouchedAgainRowWhereEmployeeWasSelected(true);
    }
  }

  public setSelectedEmployee()
  {
    if (this.ifMouseTouchedAgainRowWhereEmployeeWasSelected)
    {
      console.log("Should set");

      if (this._selectedEmployee)
      {
        if (this.employee?.id === this._selectedEmployee.id)
        {
          return;
        } else if (

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
  }

  public onSelection(employee: IEmployee)
  {
    this.ifShowBorder = false;
    this.ifSelectorActive = false;
    this.planningTableService.setEmployeeWhoWasChosenForSelection(employee);
    this.planningTableService.setRowNumberOfSelectedEmployee(this.rowNumber);
    // this.planningTableService.setColumnNumberWhereSelectionIsActive(this.columnNumber);
    this.planningTableService.setEmployeeInRow(
      employee,
      this.rowNumber,
      this.columnNumber
    );
  }

  private setEmployeeColor()
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

  public disableSelectionOfSelectedEmployee()
  {
    this.planningTableService.setEmployeeWhoWasChosenForSelection(undefined);
    this.planningTableService.setRowNumberOfSelectedEmployee(-1);
    this.planningTableService.setIfMouseTouchedAgainRowWhereEmployeeWasSelected(false);
    this.onSelectorClose();
    this.selectionNotActive();
  }
  public toggleBorderAndSelectorVisibility()
  {
    this.ifShowBorder = !this.ifShowBorder;
    this.ifShowSelector = !this.ifShowSelector;
  }

  public onSelectorClose()
  {
    if (!this.ifEmployeeWhoWasChosenShouldBeSet)
    {
      this.planningTableService.setColumnNumberWhereSelectionIsActive(-1);
    }
  }

  public selectionActive()
  {
    this.ifSelectorActive = true;
    this.setColumnNumberWhereSelectionIsActive();
  }

  public selectionNotActive()
  {
    this.ifSelectorActive = false;
  }
}
