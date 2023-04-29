import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableTableElementComponent } from './selectable-table-element.component';
import { TablesBuilderService } from 'src/app/Services/TableBuilderService/tables-builder.service';
import { IEmployee } from 'src/app/models/IEmployee';


let e1: IEmployee = {
  id: 1,
  name: 'Filipchuk',
  totalTime: 0,
  sectorPermits: [{name : 'g12r'}],
  color: 'red',
};

describe('SelectableTableElementComponent', () => {
  let component: SelectableTableElementComponent;
  let fixture: ComponentFixture<SelectableTableElementComponent>;

  let fakeTableBuilderService : TablesBuilderService;
  beforeEach(async () => {

    fakeTableBuilderService = jasmine.createSpyObj<TablesBuilderService>('TablesBuilderService', 
    {
      getTableForSubscription: undefined,
      setEmployeeInRow : undefined,
      getEmployeesForSelection : undefined,
      getWorkAndRestTimeInfo : undefined,
      getEmployeeByRowAnColumnNumber : e1
    })
    await TestBed.configureTestingModule({
      declarations: [SelectableTableElementComponent],
      providers: [{provide: TablesBuilderService, useValue: fakeTableBuilderService}],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableTableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
