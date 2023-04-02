import { Component, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { PlanningTableComponent } from '../planning-table.component';


@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber : number | undefined;
  @Input() columnNumber : number | undefined;


  employee: IEmployee = { id: undefined, name: 'No Employee', totalTime: undefined }
  availableEmployees : IEmployee[] = [];

  constructor(private planningTableComponent : PlanningTableComponent)
  {

  }

  setEmployee()
  {

  }
  
  ngOnInit(): void {
  }
}
