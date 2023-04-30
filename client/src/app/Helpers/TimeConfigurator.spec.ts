import { TimeConfigurator } from './TimeConfigurator';

describe('TimeConfigurator', () => {
  describe('ifInputValuesValid', () => {
    it('should throw an error when starting hour is less than 0', () => {
      expect(
        () => new TimeConfigurator(-1, 0, 0, 0, new Date(), 60, 120, 20)
      ).toThrowError('Starting hour is less than 0!');
    });

    it('should throw an error when ending hour is less than 0', () => {
      expect(
        () => new TimeConfigurator(0, 0, -1, 0, new Date(), 60, 120, 20)
      ).toThrowError('Ending hour is less than 0!');
    });

    it('should throw an error when starting minutes is less than 0', () => {
      expect(
        () => new TimeConfigurator(0, -1, 0, 0, new Date(), 60, 120, 20)
      ).toThrowError('Starting minutes is less than 0!');
    });

    it('should throw an error when ending minutes is less than 0', () => {
      expect(
        () => new TimeConfigurator(0, 0, 0, -1, new Date(), 60, 120, 20)
      ).toThrowError('Ending minutes is less than 0!');
    });

    it('should throw an error when time interval in minutes is less than 1', () => {
      expect(
        () => new TimeConfigurator(0, 0, 0, 0, new Date(), 0, 120, 20)
      ).toThrowError('Time interval in minutes is less than 1 minute!');
    });

    it('should throw an error when time interval in minutes is more than 120', () => {
      expect(
        () => new TimeConfigurator(0, 0, 0, 0, new Date(), 121, 120, 20)
      ).toThrowError('Time interval in minutes is more then 120 minutes!');
    });

    it('should not throw an error when input values are valid', () => {
      expect(
        () => new TimeConfigurator(0, 0, 0, 0, new Date(), 60, 120, 20)
      ).not.toThrowError();
    });
  });

  let timeConfigurator: TimeConfigurator;
  let shiftDate = new Date();

  it('should get timeColumnAsStringArray', () => {
    timeConfigurator = new TimeConfigurator(8, 0, 10, 0, shiftDate, 30, 120, 20);
    const expectedArray = [
      '08:00 - 08:30',
      '08:30 - 09:00',
      '09:00 - 09:30',
      '09:30 - 10:00',
    ];
    expect(timeConfigurator.timeColumnAsStringArray).toEqual(expectedArray);
  });

  it('should get timeColumnAsDateArray', () => {
    timeConfigurator = new TimeConfigurator(8, 0, 10, 0, shiftDate, 30, 120, 20);
    let startTime = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      8,
      0,
      0,
      0
    );
    let endTime = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      10,
      0,
      0,
      0
    );
    let st = startTime.getTime();
    let et = endTime.getTime();
    const expectedArray: Date[][] = [];
    while (st < et) {
      let row: Date[] = [];
      row.push(new Date(st), new Date(st + 30 * 60000));
      expectedArray.push(row);
      st += 30 * 60000;
    }
    expect(timeConfigurator.timeColumnAsDateArray).toEqual(expectedArray);
  });

  it('should get correct timeColumnAsStringArray after midnight', () => {
    timeConfigurator = new TimeConfigurator(23, 0, 1, 0, shiftDate, 30, 120, 20);
    const expectedArray = [
      '23:00 - 23:30',
      '23:30 - 00:00',
      '00:00 - 00:30',
      '00:30 - 01:00',
    ];
    expect(timeConfigurator.timeColumnAsStringArray).toEqual(expectedArray);
  });

  it('should get timeColumnAsDateArray', () => {
    timeConfigurator = new TimeConfigurator(23, 0, 1, 0, shiftDate, 30, 120, 20);
    let startTime = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      23,
      0,
      0,
      0
    );
    let endTime = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      25,
      0,
      0,
      0
    );
    let st = startTime.getTime();
    let et = endTime.getTime();

    const expectedArray: Date[][] = [];
    while (st < et) {
      let row: Date[] = [];
      row.push(new Date(st), new Date(st + 30 * 60000));
      expectedArray.push(row);
      st += 30 * 60000;
    }
    expect(timeConfigurator.timeColumnAsDateArray).toEqual(expectedArray);
  });
});
