import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';
import { ISector } from 'src/app/models/ISector';


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

  showSelector: boolean = false;
  ifSelected: boolean = false;
  showBorder: boolean = false;
  employeesToSelectFrom: IEmployee[] = [];
  private _employeesForShift: IEmployee[] = [];
  private _employee: IEmployee | undefined;
  color: string | undefined;

  constructor(private planningTableService: TablesBuilderService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this._employeesForShift = this.planningTableService.employeesForShift;
    this.configureProperEmployees();
    this._employee = this.planningTableService.getEmployeeByRowNumberAndSectorName(this.rowNumber, this.columnNumber);
    this.color = this._employee?.color;
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
    console.log('EColor', this.color);
  }

  onSelection($event: MatOptionSelectionChange) {
    this.toggleSelection();
    this._employee = $event.source.value;
    this.planningTableService.setEmployeeInRow(this._employee!, this.rowNumber!, this.columnNumber);
  }

  configureProperEmployees() {
    this._employeesForShift.forEach(e => {
      if (e.sectorPermits.some(s => s.name === this.sector.name)) {
        this.employeesToSelectFrom.push(e);
      }
    });
  }
}
