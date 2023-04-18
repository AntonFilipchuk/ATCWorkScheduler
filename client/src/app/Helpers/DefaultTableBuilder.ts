//Take number of sectors for the shift
//Take start and end time of the shift
//Take the number of people for the shift
//Check if each employee can work at least at one workplace
//Check if there are enough employees for the shift

//Return :
//time array ['8:10'. '8.20']
//Default employees table as 2d Array
//Full build default table for mat table to consume
//

import { IEmployee } from "../models/IEmployee";
import { IEmployeesRow } from "../models/IEmployeesRow";
import { ISector } from "../models/ISector";
import { ITableRow } from "../models/ITableRow";
import { TimeConfigurator } from "./TimeConfigurator";

export class DefaultTableBuilder {

    public timeColumnAsStringArray: string[];

    public timeColumnAsDateArray: Date[];

    public tableForEmployeesAs2DArray: IEmployeesRow[];

    public defaultTableForMatTable: ITableRow[];

    public displayedColumns: string[];

    public employeesForShift: IEmployee[];

    public sectorsForShift: ISector[];


    constructor(
        private sectors: ISector[],
        private employees: IEmployee[],
        private shiftStartTime: Date,
        private shiftEndTime: Date,
        private shiftDate: Date, timeIntervalInMinutes: number) {

        let timeConfigurator: TimeConfigurator = new TimeConfigurator
            (shiftStartTime.getHours(),
                shiftStartTime.getMinutes(),
                shiftEndTime.getHours(),
                shiftEndTime.getMinutes(),
                shiftDate,
                timeIntervalInMinutes);
        this.timeColumnAsStringArray = timeConfigurator.timeColumnAsStringArray;
        this.timeColumnAsDateArray = timeConfigurator.timeColumnAsDateArray;

        if (this.checkForMinimumAmountOfEmployees(sectors, employees) &&
            this.checkIfAllEmployeesCanWorkAtLeastOnOneSectors(sectors) &&
            this.checkNoDuplicatesInArray(employees) &&
            this.checkNoDuplicatesInArray(sectors)) {
            this.employeesForShift = employees;
            this.sectorsForShift = sectors;
            this.tableForEmployeesAs2DArray = this.buildTableForEmployeesAs2DArray(sectors);
            this.defaultTableForMatTable = this.buildDefaultTableForMatTable();
            this.displayedColumns = this.buildDisplayedColumns(sectors);
        }
        else {
            throw Error();
        }
    }

    //Display columns for Mat Table string[]
    // ['time', 'G12R', ... , 'G345P']
    private buildDisplayedColumns(sectors: ISector[]): string[] {
        let sectorNames: string[] = [];
        sectors.forEach(sector => {
            sectorNames.push(sector.name);
        });
        return ['time', ...sectorNames];
    }

    //Table row:
    // {time: Date, undefined, undefined, ... , undefined}
    private buildDefaultTableForMatTable(): ITableRow[] {
        let table: ITableRow[] = [];
        for (let i = 0; i < this.timeColumnAsDateArray.length; i++) {
            let defaultTableRow: ITableRow = { time: this.timeColumnAsStringArray[i], ...this.tableForEmployeesAs2DArray[i] }
            table.push(defaultTableRow)
        }
        return table;
    }


    //IEmployee row = {G12R : undefined}
    private buildTableForEmployeesAs2DArray(sectors: ISector[]): IEmployeesRow[] {
        let employeesTable: IEmployeesRow[] = [];
        this.timeColumnAsDateArray.forEach(time => {
            let employeesRow: IEmployeesRow = {};
            sectors.forEach(sector => {
                employeesRow[sector.name] = undefined;
            });
            employeesTable.push(employeesRow);
        });
        return employeesTable;
    };


    private checkNoDuplicatesInArray(array: any[]): boolean {
        const result: any[] = [];
        for (const item of array) {
            if (!result.includes(item)) {
                result.push(item);
            }
            else {
                console.log(`Error: an array ${JSON.stringify(array)} has a duplicate ${JSON.stringify(item)} !`);
                return false;
            }
        }
        return true;
    }

    //employeesSectors = [{name: 'G12R'}, {name: 'G12P'}]
    //_sectors = [{name: 'G12R'}, {name: 'G12P'}, {name: 'G345R'}, {name: 'G345P'}]
    private checkIfAllEmployeesCanWorkAtLeastOnOneSectors(sectors: ISector[]): boolean {
        let allCanWork = true;
        this.employees.forEach(employee => {
            if (!sectors.some(sector => employee.sectorPermits.some(s => s.name === sector.name))) {
                let employeePermitsWhoCantWork: string[] = [];
                employee.sectorPermits.forEach(sector => {
                    employeePermitsWhoCantWork.push(sector.name);
                });
                let neededPermits: string[] = [];
                sectors.forEach(sector => {
                    neededPermits.push(sector.name);
                });
                console.log(`Employee ${employee.name} cannot work`);
                console.log(`${employee.name}'s permits: ${employeePermitsWhoCantWork}`);
                console.log(`Needed permits: ${neededPermits}`);
                allCanWork = false;
            }
        });
        return allCanWork;
    }

    //Calculate if we have enough employees for the shift
    //We need at least 5 people for 4 workplaces
    //So if we have less then 1.25 people per sector => can't work
    private checkForMinimumAmountOfEmployees(sectors: ISector[], employees: IEmployee[]): boolean {
        let numberOfSectors: number = sectors.length;
        let numberOfEmployees: number = employees.length;
        let ifCanWork: boolean = numberOfEmployees / numberOfSectors >= 1.25;

        if (!ifCanWork) {
            console.log(`Not enough people for work! Coefficient : ${numberOfEmployees / numberOfSectors}`)
        }
        return ifCanWork;
    }
}