import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  public value: number | undefined;
  public color: string = 'red';
  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testService.setValue(1);
    this.getValue();
    console.log('OnInit', this.value);
  }

  private getValue() {
    this.testService.getValueForSubscription().subscribe({
      next: (response: number) => {
        this.value = response;
        if (this.value != 1) {
          this.color = 'yellow';
        }
        if (this.value === -1) {
          this.color = 'orange';
        }
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }

  public increaseValue() {
    this.value!++;
    this.testService.setValue(this.value!);
  }

  public decreaseValue() {
    this.value!--;
    this.testService.setValue(this.value!);
  }
}
