import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningWorkspaceComponent } from './planning-workspace.component';

describe('PlanningWorkspaceComponent', () => {
  let component: PlanningWorkspaceComponent;
  let fixture: ComponentFixture<PlanningWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
