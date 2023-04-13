import { Component, OnInit } from '@angular/core';
import { PlanningTableService } from '../planning-table/planning-table.service';
import { TestService } from './test.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})


export class TestComponent implements OnInit {


  constructor(private testService: TestService) {
  }

  ngOnInit() {
    
  }

}
