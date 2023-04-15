import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableTableElementComponent } from './selectable-table-element.component';

describe('SelectableTableElementComponent', () => {
  let component: SelectableTableElementComponent;
  let fixture: ComponentFixture<SelectableTableElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectableTableElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectableTableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
