import { Component, OnInit } from '@angular/core';
import { PlanningTableService } from '../planning-table/planning-table.service';


const sectors: string[] = ['G12R', 'G12P'];

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
];

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})


export class TestComponent implements OnInit {
  
  constructor(private planningTableService: PlanningTableService)
  {

  }
 
  displayedColumns: string[] = ['Time', 'G1', 'G2'];
  dataSource = this.planningTableService.table;

  ngOnInit() {
    console.log(this.planningTableService.table);
    
  }
}
