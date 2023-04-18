//Take number of sectors for the shift
//Take start and end time of the shift
//Take the number of people for the shift
//Check if each employee can work at least at one workplace
//Check if there are enough employees for the shift

//Expose :
//time array ['8:10'. '8.20']
//Default employees table as 2d Array
//Full build default table for mat table to consume

import { IEmployee } from "../models/IEmployee";
import { IEmployeesRow } from "../models/IEmployeesRow";
import { ISector } from "../models/ISector";
import { ITableRow } from "../models/ITableRow";
import { TimeConfigurator } from "./TimeConfigurator";

export class DefaultTableBuilder {
    private _sectors: ISector[];
    private _employees: IEmployee[];
    private _shiftStartTime!: Date;
    private _shiftEndTime!: Date;

    public timeColumnAsStringArray: string[];

    public timeColumnAsDateArray: Date[];

    public tableForEmployeesAs2DArray: IEmployeesRow[];

    public defaultTableForMatTable: ITableRow[];

    public displayedColumns: string[];

    constructor(
        private sectors: ISector[],
        private employees: IEmployee[],
        private shiftStartTime: Date,
        private shiftEndTime: Date,
        private shiftDate: Date, timeIntervalInMinutes: number) {

        this._sectors = sectors;
        this._employees = employees;
        this._shiftStartTime = shiftStartTime;
        this._shiftEndTime = shiftEndTime;
        let timeConfigurator: TimeConfigurator = new TimeConfigurator
            (shiftStartTime.getHours(),
                shiftStartTime.getMinutes(),
                shiftEndTime.getHours(),
                shiftEndTime.getMinutes(),
                shiftDate,
                timeIntervalInMinutes);
        this.timeColumnAsStringArray = timeConfigurator.timeColumnAsStringArray;
        this.timeColumnAsDateArray = timeConfigurator.timeColumnAsDateArray;

        if (this.checkForMinimumAmountOfEmployees() &&
            this.checkIfAllEmployeesCanWorkAtLeastOnOneSectors() &&
            this.checkNoDuplicatesInArray(this._employees) && 
            this.checkNoDuplicatesInArray(this.sectors)) {
            this.tableForEmployeesAs2DArray = this.buildTableForEmployeesAs2DArray();
            this.defaultTableForMatTable = this.buildDefaultTableForMatTable();
            this.displayedColumns = this.buildDisplayedColumns();
        }
        else {
            throw Error();
        }
    }

    //Display columns for Mat Table string[]
    // ['time', 'G12R', ... , 'G345P']
    private buildDisplayedColumns(): string[] {
        let sectorNames: string[] = [];
        this._sectors.forEach(sector => {
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
    private buildTableForEmployeesAs2DArray(): IEmployeesRow[] {
        let employeesTable: IEmployeesRow[] = [];
        this.timeColumnAsDateArray.forEach(time => {
            let employeesRow: IEmployeesRow = {};
            this._sectors.forEach(sector => {
                employeesRow[sector.name] = undefined;
            });
            employeesTable.push(employeesRow);
        });
        return employeesTable;
    };


    private checkNoDuplicatesInArray(array: any[]): boolean {
        return new Set(array).size < array.length;
    }

    //employeesSectors = [{name: 'G12R'}, {name: 'G12P'}]
    //_sectors = [{name: 'G12R'}, {name: 'G12P'}, {name: 'G345R'}, {name: 'G345P'}]
    private checkIfAllEmployeesCanWorkAtLeastOnOneSectors(): boolean {
        let allCanWork = true;
        this.employees.forEach(employee => {
            if (!this._sectors.some(sector => employee.sectorPermits.some(s => s.name === sector.name))) {
                let employeePermitsWhoCantWork: string[] = [];
                employee.sectorPermits.forEach(sector => {
                    employeePermitsWhoCantWork.push(sector.name);
                });
                let neededPermits: string[] = [];
                this._sectors.forEach(sector => {
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
    private checkForMinimumAmountOfEmployees(): boolean {
        let numberOfSectors: number = this._sectors.length;
        let numberOfEmployees: number = this._employees.length;
        let ifCanWork: boolean = numberOfEmployees / numberOfSectors >= 1.25;

        if (!ifCanWork) {
            console.log(`Not enough people for work! Coefficient : ${numberOfEmployees / numberOfSectors}`)
        }
        return ifCanWork;
    }
}