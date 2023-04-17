import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber: number | undefined;
  @Input() columnNumber: number | undefined;
  @Input() employee!: IEmployee;

  color: string = 'red';
  showSelector: boolean = false;
  ifSelected: boolean = false;

  constructor(private planningTableService: TablesBuilderService) {
  }

  setEmployee() {
  }

  ngOnInit(): void {
    console.log(this.rowNumber + ' ' + this.columnNumber);
  }

  toggleSelectorVisibility() {
    if (!this.showSelector && !this.ifSelected) {
      this.showSelector = true;
      this.ifSelected = true;
    }
    else if (this.ifSelected) {
      this.ifSelected = !this.ifSelected;
    }
  }

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  selectorChange($event: MatOptionSelectionChange) {
    this.ifSelected = false;
    this.showSelector = false;
  }

  test() {
    console.log('Test')
  }
}
