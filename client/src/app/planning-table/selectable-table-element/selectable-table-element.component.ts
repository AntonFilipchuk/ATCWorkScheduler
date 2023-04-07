import { Component, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { PlanningTableComponent } from '../planning-table.component';
import { PlanningTableService } from '../planning-table.service';


@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber: number | undefined;
  @Input() sectorName: string | undefined;
  @Input() employee: IEmployee = { id: undefined, name: 'No Employee', totalTime: undefined };


  constructor(private planningTableService: PlanningTableService) {

  }

  setEmployee() {
    this.planningTableService.setEmployee({
      id: 4,
      name: 'Jane',
      totalTime: 0
    }, this.rowNumber!, this.sectorName!);
  }

  ngOnInit(): void {
  }
}
