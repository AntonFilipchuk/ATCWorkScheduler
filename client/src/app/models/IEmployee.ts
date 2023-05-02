import { ISector } from "./ISector";

export interface IEmployee
{
    id: number,
    name: string,
    totalTime: number,
    sectorPermits: ISector[],
    color: string;
}