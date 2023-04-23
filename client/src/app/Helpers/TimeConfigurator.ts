export class TimeConfigurator {

    private _startingHour: number = 0;
    private _startingMinutes: number = 0;
    private _endingHour: number = 0;
    private _endingMinutes: number = 0;

    private _shiftStartTime: Date = new Date();
    private _shiftEndTime: Date = new Date();
    private _shiftDate: Date = new Date();

    public timeColumnAsStringArray: string[] = [];
    public timeColumnAsDateArray: Date[][] = [];



    constructor(startingHour: number, startingMinutes: number,
        endingHour: number, endingMinutes: number, shiftDate: Date, timeIntervalInMinutes: number) {

        if (endingHour < startingHour) {
            this._endingHour = 24 + endingHour;
        } else {
            this._endingHour = endingHour;
        }
        this._startingHour = startingHour;

        this._startingMinutes = startingMinutes;
        this._endingMinutes = endingMinutes;
        this._shiftDate = shiftDate;
        this.configureStartAndEndOfShift();
        this.configureTimeIntervals(timeIntervalInMinutes);
    }

    configureTimeIntervals(timeIntervalInMinutes: number) {

        let startInMilliseconds = this._shiftStartTime.getTime();
        let endInMilliseconds = this._shiftEndTime.getTime();
        let timeIntervalInMilliseconds = this.minutesToMilliseconds(timeIntervalInMinutes);

        //[8:00 - 8:10] 8:00 - firstTimeToAdd, 8:10 - secondTimeToAdd
        let firstTime: Date = new Date(startInMilliseconds);
        let secondTime: Date = new Date(startInMilliseconds + timeIntervalInMilliseconds);

        while (secondTime.getTime() < endInMilliseconds) {
            firstTime.setTime(startInMilliseconds);
            secondTime.setTime(firstTime.getTime() + timeIntervalInMilliseconds);
            const timeIntervalToAdd: Date[] = [new Date(firstTime), new Date(secondTime)];

            this.timeColumnAsDateArray.push(timeIntervalToAdd);

            this.timeColumnAsStringArray.push(
                this.timeToString(firstTime.getHours()) + ':' + this.timeToString(firstTime.getMinutes())
                + ' - ' +
                this.timeToString(secondTime.getHours()) + ':' + this.timeToString(secondTime.getMinutes()));

            startInMilliseconds += timeIntervalInMilliseconds;
        }
    }

    configureStartAndEndOfShift() {

        this._shiftStartTime = new Date(
            this._shiftDate.getFullYear(),
            this._shiftDate.getMonth(),
            this._shiftDate.getDate(),
            this._startingHour,
            this._startingMinutes);

        this._shiftEndTime = new Date(
            this._shiftDate.getFullYear(),
            this._shiftDate.getMonth(),
            this._shiftDate.getDate(),
            this._endingHour,
            this._endingMinutes);
    }

    minutesToMilliseconds(minutes: number): number {
        return minutes * 60000;
    }

    timeToString(time: number): string {
        if (time > 9) {
            return time.toString();
        }
        return '0' + time.toString();
    }
}