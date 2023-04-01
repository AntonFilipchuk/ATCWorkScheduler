import { Component, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { PlanningTableComponent } from '../planning-table.component';


@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() time : number | undefined;
  @Input() sectorName : string | undefined;
  @Input() index : number | undefined;
  employee: IEmployee = { id: undefined, name: 'No Employee', totalTime: undefined }
  availableEmployees : IEmployee[] = [];

  constructor(private planningTableComponent : PlanningTableComponent)
  {
    this.availableEmployees = planningTableComponent.employees;
    console.log(this.availableEmployees);    
  }
  setEmployee()
  {
    this.employee = this.availableEmployees[0];
  }
  
  ngOnInit(): void {
    console.log(this.time);
    console.log(this.sectorName);
    console.log(this.index + "!");
    
    
  }
}
