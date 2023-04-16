import { Component } from '@angular/core';

export interface PeriodicElement {
  name: string;
  time : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { time: '8:10 - 9:10', name: 'R'},
  { time: '9:40 - 10:30', name: 'R'},
  { time: '11:00 - 11:40', name: 'P'},
  { time: '12:10 - 13:10', name: 'R'},
];

@Component({
  selector: 'app-employee-info-table',
  templateUrl: './employee-info-table.component.html',
  styleUrls: ['./employee-info-table.component.scss']
})
export class EmployeeInfoTableComponent {
  displayedColumns: string[] = ['Anton', 'G12'];
  dataSource = ELEMENT_DATA;
}
