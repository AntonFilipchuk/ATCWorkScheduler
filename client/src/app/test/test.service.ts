import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

let table = [{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' }];

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private timeIntervals: Date[] = [];
  private shiftStartTime: Date = new Date();
  private shiftEndTime: Date = new Date();
  public shiftDate: Date = new Date();

  constructor() {
    this.configureTime(8, 10, 14, 50);
    this.configureTimeIntervals(this.shiftStartTime, this.shiftEndTime, 23);
    console.log(this.timeIntervals);

  }


  configureTimeIntervals(shiftStartTime: Date, shiftEndTime: Date, timeIntervalInMinutes: number) {
    let startInMilliseconds = shiftStartTime.valueOf();
    let endInMilliseconds = shiftEndTime.valueOf();
    let timeIntervalInMilliseconds = this.minutesToMilliseconds(timeIntervalInMinutes);

    while (startInMilliseconds <= endInMilliseconds) {
      this.timeIntervals.push(new Date(startInMilliseconds));
      if ((startInMilliseconds + timeIntervalInMilliseconds) > endInMilliseconds) {
        this.timeIntervals.push(new Date(endInMilliseconds));
        break;
      }
      else {
        startInMilliseconds += timeIntervalInMilliseconds;
      }
    }
  }


  configureTime(startingHour: number, startingMinutes: number,
    endingHour: number, endingMinutes: number) {

    this.shiftStartTime = new Date(
      this.shiftDate.getFullYear(),
      this.shiftDate.getMonth(),
      this.shiftDate.getDate(),
      startingHour,
      startingMinutes);

    this.shiftEndTime = new Date(
      this.shiftDate.getFullYear(),
      this.shiftDate.getMonth(),
      this.shiftDate.getDate(),
      endingHour,
      endingMinutes);
  }

  minutesToMilliseconds(minutes: number): number {
    return minutes * 60000;
  }

}
