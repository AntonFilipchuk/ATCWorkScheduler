import { Component, OnInit } from '@angular/core';
import { PlanningTableService } from '../planning-table/planning-table.service';


const sectors: string[] = ['G12R', 'G12P'];

export interface PeriodicElement {
  name: string;
  weight: number;
  symbol: string;
}

const POSITION_DATA =
[
  {position: 1},
  {position: 2}
]

const ELEMENT_DATA: PeriodicElement[] = [
  {  name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  {  name: 'Helium', weight: 4.0026, symbol: 'He' },
];

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})


export class TestComponent implements OnInit {
  
  constructor()
  {

  }
 
  displayedColumns: string[] = ['Name', 'weight', 'symbol'];
  positionDisplayedColumn: string[] = ['Position'];
  elementsDataSource = ELEMENT_DATA;
  positionsDataSource = POSITION_DATA;

  ngOnInit() {
    
    
  }
}
