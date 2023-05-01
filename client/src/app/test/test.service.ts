import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

let table = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
];

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private _$value: ReplaySubject<number> = new ReplaySubject<number>();
  private _value: number = -1;
  constructor() {}

  public setValue(value: number) {
    this._value = value;
    this._$value.next(this._value);
  }
  public getValueForSubscription(): Observable<number> {
    return this._$value;
  }
}
