import { IEmployee } from "../models/IEmployee";
import { ISector } from "../models/ISector";
import { IWorkAndRestTimeInfo } from "../models/ITimeOfWorkInfo";
import { ObjectsComparisonHelper } from "./ObjectsComparisonHelper";

export class EmployeesWhoCanWorkEvaluator {
    public employeesWhoCanWork: IEmployee[] = []
    private _objComparisonHelper = new ObjectsComparisonHelper();

    public getEmployeesWhoCanWork(
        employeesForShift: IEmployee[],
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        firstMaxWorkTimeInMinutes: number | undefined,
        secondMaxWorkTimeInMinutes: number,
        firstMinRestTimeInMinutes: number | undefined,
        secondMinRestTimeInMinutes: number,
        timeIntervalInMinutes: number,
        sector: ISector): IEmployee[] {

        let validEmployeesForSelection: IEmployee[] = [];
        for (let i = 0; i < employeesForShift.length; i++) {
            const employee: IEmployee = employeesForShift[i];

            if (!employee) {
                continue;
            }
            //Check if an employee has a permit for sector
            const employeeSectorPermits: ISector[] = employee.sectorPermits;
            const ifEmployeeHasPermitForSector = this._objComparisonHelper.ifArrayHasAnObject(employeeSectorPermits, sector);

            if (!ifEmployeeHasPermitForSector) {
                continue;
            }

            let ifEmployeeCanBeAddedForSelection = this.ifEmployeeCanBeAddedForSelection(
                employee,
                rowNumber,
                employeesTableAs2DArray,
                firstMaxWorkTimeInMinutes,
                secondMaxWorkTimeInMinutes,
                firstMinRestTimeInMinutes,
                secondMinRestTimeInMinutes,
                timeIntervalInMinutes);

            if (ifEmployeeCanBeAddedForSelection) {
                validEmployeesForSelection.push(employee);
            }
            else {
                continue;
            }
        }
        return validEmployeesForSelection;
    }

    public getWorkAndRestTimeInfo(
        employee: IEmployee,
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        timeIntervalInMinutes: number): IWorkAndRestTimeInfo {

        let currentWorkTime: number = 0;

        let totalWorkTime: number = 0;
        let lastWorkTime: number = 0;

        let totalRestTime: number = 0;
        let lastRestTime: number = 0;

        let nextWorkTime: number = 0;

        //Total Work and Rest Time
        [totalWorkTime, totalRestTime] = this.calculateTotalWorkAndRestTime(employee, employeesTableAs2DArray, timeIntervalInMinutes);

        //Last Work and Rest Time
        [lastWorkTime, lastRestTime] = this.calculateLastWorkAndRestTime(employee, rowNumber, employeesTableAs2DArray, timeIntervalInMinutes);

        //CurrentWorkTime
        currentWorkTime = this.calculateCurrentWorkTime(employee, rowNumber, employeesTableAs2DArray, timeIntervalInMinutes);

        nextWorkTime = this.calculateNextWorkTime(employee, rowNumber, employeesTableAs2DArray, timeIntervalInMinutes);

        let workAndRestInfo: IWorkAndRestTimeInfo =
        {
            lastRestTimeInMinutes: lastRestTime,
            lastWorkTimeInMinutes: lastWorkTime,
            totalRestTimeInMinutes: totalRestTime,
            totalWorkingTimeInMinutes: totalWorkTime,
            currentWorkTimeInMinutes: currentWorkTime,
            nextWorkTimeInMinutes: nextWorkTime
        }
        return workAndRestInfo;
    }

    private calculateNextWorkTime(employee: IEmployee, rowNumber: number, employeesTableAs2DArray: (IEmployee | undefined)[][],
        timeIntervalInMinutes: number): number {
        let nextWorkTime: number = 0;
        let nextRow = rowNumber + 1;
        //Check if we are not the last row, if it is
        //future work is always 0
        if (nextRow >= employeesTableAs2DArray.length) {
            return 0;
        }

        while (nextRow < employeesTableAs2DArray.length) {
            //Check if the next row has employee
            //if does, check next
            if (this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)) {
                nextRow += 1;
            }
            else {
                //If it doesn't have
                while (nextRow < employeesTableAs2DArray.length) {
                    //Skip all rows that don't have an employee
                    if (!this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)) {
                        nextRow += 1;
                    }
                    //Find the row that has, and get it's current time of work
                    else {
                        return this.calculateCurrentWorkTime(employee, nextRow, employeesTableAs2DArray, timeIntervalInMinutes);
                    }
                }
            }
        }




        return nextWorkTime;
    }

    private ifEmployeeCanBeAddedForSelection(
        employee: IEmployee,
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        firstMaxWorkTimeInMinutes: number | undefined,
        secondMaxWorkTimeInMinutes: number,
        firstMinRestTimeInMinutes: number | undefined,
        secondMinRestTimeInMinutes: number,
        timeIntervalInMinutes: number): boolean {

        if (this.ifEmployeeAlreadyWorks(employee, rowNumber, employeesTableAs2DArray)) {
            return false;
        }

        let employeesTableAs2DArrayLength: number = employeesTableAs2DArray.length - 1;
        let previousRow = rowNumber - 1;
        let nextRow = rowNumber + 1;
        //Check if trying to set an employee in the middle
        // length = 6
        //0 [e1, e2]
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [undefined, undefined] <-- trying to set e1 here
        //4 [e1, e2]
        //5 [e1, e2] 
        //Check if we do not exceed the boundaries of employeesAs2DArray
        //Then check if the next and the previous rows have the same employee 
        if ((previousRow >= 0 && nextRow <= employeesTableAs2DArrayLength) &&
            (this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)
                && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[previousRow], employee))) {
            let previousWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, previousRow, employeesTableAs2DArray, timeIntervalInMinutes);
            let nextWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, nextRow, employeesTableAs2DArray, timeIntervalInMinutes);

            //Check if the sum of workTime t1 + t2 and if 
            //0 [e1, e2] -\
            //1 [e1, e2] ---> t1
            //2 [e1, e2] -/
            //3 [undefined, undefined] <-- trying to set e1 here
            //4 [e1, e2] -\ _> t2
            //5 [e1, e2] -/ 
            let sumOfPreviousAndFutureWorkTime: number =
                previousWorkTimeInfo.currentWorkTimeInMinutes + nextWorkTimeInfo.currentWorkTimeInMinutes;

            return this.ifEmployeeHadRestAndCanWork(
                sumOfPreviousAndFutureWorkTime,
                previousWorkTimeInfo.lastRestTimeInMinutes,
                previousWorkTimeInfo.lastWorkTimeInMinutes,
                firstMaxWorkTimeInMinutes,
                secondMaxWorkTimeInMinutes,
                firstMinRestTimeInMinutes,
                secondMinRestTimeInMinutes,
                timeIntervalInMinutes);
        }

        //If we are trying to add employee before
        //0 [undefined, undefined] <-- trying to set e1 here
        //1 [e1, e2]
        //2 [e1, e2] 
        if ((rowNumber + 1 <= employeesTableAs2DArrayLength) && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[nextRow], employee)) {
            let nextWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, nextRow, employeesTableAs2DArray, timeIntervalInMinutes);
            let previousWorkTimeInfo: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, rowNumber, employeesTableAs2DArray, timeIntervalInMinutes);
            return this.ifEmployeeHadRestAndCanWork(
                nextWorkTimeInfo.currentWorkTimeInMinutes,
                previousWorkTimeInfo.lastRestTimeInMinutes,
                previousWorkTimeInfo.lastWorkTimeInMinutes,
                firstMaxWorkTimeInMinutes,
                secondMaxWorkTimeInMinutes,
                firstMinRestTimeInMinutes,
                secondMinRestTimeInMinutes,
                timeIntervalInMinutes);
        }

        //If we are trying to set employee after    
        //0 [e1, e2] 
        //1 [e1, e2]
        //2 [undefined, undefined] <-- trying to set e1 here
        const workAndRestTime: IWorkAndRestTimeInfo = this.getWorkAndRestTimeInfo(employee, rowNumber, employeesTableAs2DArray, timeIntervalInMinutes);
        const currentWorkTime: number = workAndRestTime.currentWorkTimeInMinutes;
        const lastRestTime: number = workAndRestTime.lastRestTimeInMinutes;
        const lastWorkTime: number = workAndRestTime.lastWorkTimeInMinutes;

        return this.ifEmployeeHadRestAndCanWork(
            currentWorkTime,
            lastRestTime,
            lastWorkTime,
            firstMaxWorkTimeInMinutes,
            secondMaxWorkTimeInMinutes,
            firstMinRestTimeInMinutes,
            secondMinRestTimeInMinutes,
            timeIntervalInMinutes);
    }

    private ifEmployeeAlreadyWorks(employee: IEmployee, rowNumber: number, employeesAs2DArray: (IEmployee | undefined)[][]) {
        let ifRowAlreadyHasEmployee = this._objComparisonHelper.ifArrayHasAnObject(employeesAs2DArray[rowNumber], employee);
        return ifRowAlreadyHasEmployee;
    }

    private ifEmployeeHadRestAndCanWork(
        currentWorkTime: number,
        lastRestTime: number,
        lastWorkTime: number,
        firstMaxWorkTime: number | undefined,
        secondMaxWorkTime: number,
        firstMinRestTimeInMinutes: number | undefined,
        secondMinRestTimeInMinutes: number,
        timeIntervalInMinutes: number): boolean {

        // if ((firstMinRestTimeInMinutes && firstMaxWorkTime) &&
        //     ((currentWorkTime  < firstMaxWorkTime) && lastRestTime >= firstMinRestTimeInMinutes)) {
        //     return true;
        // }
        // if ((currentWorkTime === 0) && (lastWorkTime >= secondMaxWorkTime) && (lastRestTime >= secondMinRestTimeInMinutes)) {
        //     return true;
        // }
        // else 

        if (currentWorkTime < secondMaxWorkTime) {
            if (lastRestTime >= secondMinRestTimeInMinutes) {
                return true;
            }
        }
        return false;
    }


    private calculateTotalWorkAndRestTime(
        employee: IEmployee,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        timeIntervalInMinutes: number): [number, number] {
        let totalWorkTime: number = 0;
        let totalRestTime: number = 0;

        employeesTableAs2DArray.forEach(employeesRow => {
            if (this._objComparisonHelper.ifArrayHasAnObject(employeesRow, employee)) {
                totalWorkTime += timeIntervalInMinutes;
            }
            else {
                totalRestTime += timeIntervalInMinutes;
            }
        });

        return [totalWorkTime, totalRestTime];
    }

    private calculateCurrentWorkTime(
        employee: IEmployee,
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        timeIntervalInMinutes: number): number {
        //0 [e1, e2]
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [e1, e2] <-- start here
        //4 [e1, e2]
        //5 [e3, e2] 
        let currentWorkTime: number = 0;
        let rowWithLastTimeOfWork = rowNumber;

        //0 [e1, e2]
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [e1, e2] 
        //4 [e1, e2] 
        //5 [e3, e2] <-- end here
        while (rowWithLastTimeOfWork < employeesTableAs2DArray.length
            && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
            rowWithLastTimeOfWork += 1;
        }

        //0 [e1, e2]
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [e1, e2] 
        //4 [e1, e2] <-- back here
        //5 [e3, e2] 
        rowWithLastTimeOfWork -= 1;

        //0 [e1, e2] <-- end here
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [e1, e2] 
        //4 [e1, e2] <--start here
        //5 [e3, e2] 
        while (rowWithLastTimeOfWork >= 0 && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[rowWithLastTimeOfWork], employee)) {
            currentWorkTime += timeIntervalInMinutes;
            rowWithLastTimeOfWork -= 1;
        }

        return currentWorkTime;
    }

    private ifFirstWorkSession(
        employee: IEmployee,
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][]): boolean {

        // This method checks for the edge case
        // The problem - can not calculate last work and rest time
        // if it's the fist work session

        //First check if it's the first row
        if (rowNumber === 0) { return true; }

        //Else we need to check rows that are above
        rowNumber -= 1;

        //Then we need to find if row, where we want to set an employee
        //is the row of first time session
        //If the row above has employee and the rowNumber is greater or equal to 0
        //then check the next row
        //0 [e3, e2]
        //1 [e3, e2]
        //2 [e1, e2] <-- end here
        //3 [e1, e2] 
        //4 [e1, e2] <-- start here
        //5 [e3, e2] 


        while (rowNumber >= 0 && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[rowNumber], employee)) {
            if (rowNumber === 0) {
                return true;
            }
            rowNumber -= 1;
        }

        //if the row is not 0, we might have 
        //another row, where the employee is set
        //0 [e1, e2] <-- like this
        //1 [e3, e2]
        //2 [e1, e2] <-- ended here
        //3 [e1, e2] 
        //4 [e1, e2] 
        //5 [e3, e2] 
        //So we need to confirm that there are no more rows with employee
        while (rowNumber >= 0 && !this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[rowNumber], employee)) {
            if (rowNumber === 0) {
                return true;
            }
            rowNumber -= 1;
        }

        //Else if have a row with employee - that means it's not the first work session
        return false;
    }

    private calculateLastWorkAndRestTime(
        employee: IEmployee,
        rowNumber: number,
        employeesTableAs2DArray: (IEmployee | undefined)[][],
        timeIntervalInMinutes: number): [number, number] {

        //Check for edge case
        if (this.ifFirstWorkSession(employee, rowNumber, employeesTableAs2DArray)) {
            return [0, 20];
        }

        let lastWorkTime: number = 0;
        let lastRestTime: number = 0;


        //Last Work time
        //If an employee worked on previous time period
        //Decrement row to find when was the last rest time period
        //0 [e1, e2] 
        //1 [e3, e2] <-- end here (for e1)
        //2 [e1, e2]
        //3 [e1, e2]
        //4 [e1, e2] <-- start here
        let row: number = rowNumber - 1;
        //1-1 = 0
        //skip
        if (row > 0 && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[row], employee)) {
            while (this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[row], employee) && row > 0) {
                row = row - 1;
            }
        }

        //Then skip all the rest time periods
        //But for the each rest time period add rest time
        //0 [e1, e2] <-- end here
        //1 [e3, e2] 
        //2 [e3, e2]
        //3 [e3, e2] <-- start here
        //4 [e1, e2]
        //skip
        while (row >= 0 && !this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[row], employee)) {
            lastRestTime += timeIntervalInMinutes;
            row = row - 1;
        }

        //Now count the previous time work
        //0 [e1, e2] <-- end here
        //1 [e1, e2] 
        //2 [e1, e2]
        //3 [e1, e2] 
        //4 [e1, e2] <-- start here
        while (row >= 0 && this._objComparisonHelper.ifArrayHasAnObject(employeesTableAs2DArray[row], employee)) {
            lastWorkTime += timeIntervalInMinutes;
            row = row - 1;
        }

        return [lastWorkTime, lastRestTime];
    }

}