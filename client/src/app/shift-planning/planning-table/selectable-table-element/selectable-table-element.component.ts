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

  @Input() rowNumber: number | undefined;
  @Input() columnNumber: number | undefined;
  @Input() employee!: IEmployee;
  @Input() employees!: IEmployee[];
  @Input() sector!: ISector;

  showSelector: boolean = false;
  ifSelected: boolean = false;
  showBorder: boolean = false;
  employeesToSelectFrom: IEmployee[] = [];
  selectedEmployee: IEmployee | undefined;
  l: boolean = true;
  color!: string;

  constructor(private planningTableService: TablesBuilderService, private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.configureProperEmployees();
    this.color = 'grey'
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
    this.selectedEmployee = $event.source.value;
    this.color = this.selectedEmployee!.color;
    //this.planningTableService.setEmployee(this.selectedEmployee!, this.rowNumber!, this.sector.name);
  }

  configureProperEmployees() {
    this.employees.forEach(e => {
      if (e.sectorPermits.some(s => s.name === this.sector.name)) {
        this.employeesToSelectFrom.push(e);
      }
    });
  }

  test() {
    this.color = 'pink';
    console.log(this.color);

  }
}
