export class TimeConfigurator {

    private _startingHour: number = 0;
    private _startingMinutes: number = 0;
    private _endingHour: number = 0;
    private _endingMinutes: number = 0;

    private _shiftStartTime: Date = new Date();
    private _shiftEndTime: Date = new Date();
    private _shiftDate: Date = new Date();

    public timeColumnAsStringArray: string[] = [];
    public timeColumnAsDateArray: Date[] = [];


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
        let startInMilliseconds = this._shiftStartTime.valueOf();
        let endInMilliseconds = this._shiftEndTime.valueOf();
        let timeIntervalInMilliseconds = this.minutesToMilliseconds(timeIntervalInMinutes);

        let timeToAdd: Date = new Date();
        while (startInMilliseconds <= endInMilliseconds) {
            timeToAdd = new Date(startInMilliseconds);

            if ((startInMilliseconds + timeIntervalInMilliseconds) > endInMilliseconds) {
                this.timeColumnAsStringArray.push(this.timeToString(timeToAdd.getHours()) + ':' + this.timeToString(timeToAdd.getMinutes()));
                this.timeColumnAsDateArray.push(timeToAdd);
                break;
            }
            else {
                startInMilliseconds += timeIntervalInMilliseconds;
                this.timeColumnAsStringArray.push(this.timeToString(timeToAdd.getHours()) + ':' + this.timeToString(timeToAdd.getMinutes()));
                this.timeColumnAsDateArray.push(timeToAdd);
            }
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