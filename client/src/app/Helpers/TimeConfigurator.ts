export class TimeConfigurator {
  private _shiftStartTime: Date = new Date();
  private _shiftEndTime: Date = new Date();

  private _timeColumnAsStringArray: string[] = [];
  private _timeColumnAsDateArray: Date[][] = [];

  constructor(
    private _startingHour: number,
    private _startingMinutes: number,
    private _endingHour: number,
    private _endingMinutes: number,
    private _shiftDate: Date,
    private _timeIntervalInMinutes: number
  ) {

    this.ifInputValuesValid();

    if (this._endingHour < this._startingHour) {
      this._endingHour = 24 + this._endingHour;
    }

    this.configureStartAndEndOfShift();
    this.configureTimeIntervals(this._timeIntervalInMinutes);
  }

  
  public get timeColumnAsStringArray() : string[] {
    return this._timeColumnAsStringArray;
  }

  
  public get timeColumnAsDateArray() : Date[][] {
    return this._timeColumnAsDateArray;
  }
  
  

  private ifInputValuesValid() {
    if (this._startingHour < 0) {
      throw new Error('Starting hour is less than 0!');
    }
    if (this._endingHour < 0) {
      throw new Error('Ending hour is less than 0!');
    }
    if (this._startingMinutes < 0) {
      throw new Error('Starting minutes is less than 0!');
    }
    if (this._endingMinutes < 0) {
      throw new Error('Ending minutes is less than 0!');
    }
    if (this._timeIntervalInMinutes < 1) {
      throw new Error('Time interval in minutes is less than 1 minute!');
    }
    if(this._timeIntervalInMinutes > 120)
    {
        throw new Error('Time interval in minutes is more then 120 minutes!');
    }
  }

  private configureTimeIntervals(timeIntervalInMinutes: number) {
    let startInMilliseconds = this._shiftStartTime.getTime();
    let endInMilliseconds = this._shiftEndTime.getTime();
    let timeIntervalInMilliseconds = this.minutesToMilliseconds(
      timeIntervalInMinutes
    );

    //[8:00 - 8:10] 8:00 - firstTimeToAdd, 8:10 - secondTimeToAdd
    let firstTime: Date = new Date(startInMilliseconds);
    let secondTime: Date = new Date(
      startInMilliseconds + timeIntervalInMilliseconds
    );

    while (secondTime.getTime() < endInMilliseconds) {
      firstTime.setTime(startInMilliseconds);
      secondTime.setTime(firstTime.getTime() + timeIntervalInMilliseconds);
      const timeIntervalToAdd: Date[] = [
        new Date(firstTime),
        new Date(secondTime),
      ];

      this._timeColumnAsDateArray.push(timeIntervalToAdd);

      this._timeColumnAsStringArray.push(
        this.timeToString(firstTime.getHours()) +
          ':' +
          this.timeToString(firstTime.getMinutes()) +
          ' - ' +
          this.timeToString(secondTime.getHours()) +
          ':' +
          this.timeToString(secondTime.getMinutes())
      );

      startInMilliseconds += timeIntervalInMilliseconds;
    }
  }

  private configureStartAndEndOfShift() {
    this._shiftStartTime = new Date(
      this._shiftDate.getFullYear(),
      this._shiftDate.getMonth(),
      this._shiftDate.getDate(),
      this._startingHour,
      this._startingMinutes
    );

    this._shiftEndTime = new Date(
      this._shiftDate.getFullYear(),
      this._shiftDate.getMonth(),
      this._shiftDate.getDate(),
      this._endingHour,
      this._endingMinutes
    );
  }

  private minutesToMilliseconds(minutes: number): number {
    return minutes * 60000;
  }

  private timeToString(time: number): string {
    if (time > 9) {
      return time.toString();
    }
    return '0' + time.toString();
  }
}
