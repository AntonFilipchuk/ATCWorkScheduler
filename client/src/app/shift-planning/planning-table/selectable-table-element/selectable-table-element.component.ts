import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { IEmployeesRow } from 'src/app/models/IEmployeesRow';


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
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber: number | undefined;
  @Input() columnNumber: number | undefined;
  @Input() employee!: IEmployee;
  @Input() employees!: IEmployee[];

  showSelector: boolean = false;
  ifSelected: boolean = false;
  showBorder: boolean = false;

  constructor(private planningTableService: TablesBuilderService) {
  }

  ngOnInit(): void {
    console.log(this.employees);
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

  onSelection() {

    this.ifSelected = true;
    this.toggle();
  }



}
