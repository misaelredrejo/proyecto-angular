import { Action } from './enums.model';

export interface FilterQuery {
    username?: string,
    action?: Action,
    startDate: string,
    endDate: string
}