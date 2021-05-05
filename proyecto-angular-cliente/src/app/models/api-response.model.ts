import { Status } from './enums.model';

export interface ApiResponse {
    status: Status;
    message: string;
    data: any;
}