import { Component, OnInit } from '@angular/core';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';

@Component({
  selector: 'app-planning-workspace',
  templateUrl: './planning-workspace.component.html',
  styleUrls: ['./planning-workspace.component.scss']
})
export class PlanningWorkspaceComponent implements OnInit {

  public employees : IEmployee[] = [];
  constructor(private tablesBuilderService : TablesBuilderService){}
  ngOnInit(): void
  {
    this.employees = this.tablesBuilderService.employees;
  }
}
