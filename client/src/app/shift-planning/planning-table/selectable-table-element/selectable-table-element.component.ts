import { Component, Input, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/IEmployee';
import { MainTableComponent } from '../main-table.component';
import { TablesBuilderService } from 'src/app/Services/tables-builder.service';



@Component({
  selector: 'app-selectable-table-element',
  templateUrl: './selectable-table-element.component.html',
  styleUrls: ['./selectable-table-element.component.scss']
})
export class SelectableTableElementComponent implements OnInit {

  @Input() rowNumber: number | undefined;
  @Input() sectorNumber: number | undefined;
  @Input() employee!: IEmployee;

  constructor(private planningTableService: TablesBuilderService) {

  }

  setEmployee() {
  }

  ngOnInit(): void {
  }
}
