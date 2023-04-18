import { ISector } from "./ISector";

export interface IEmployee {
    id: number | undefined,
    name: string | undefined,
    totalTime: number | undefined,
    sectorPermits : ISector[],
    color : string;
}