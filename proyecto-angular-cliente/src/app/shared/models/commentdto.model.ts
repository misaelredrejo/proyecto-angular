import { Action } from './enums.model';


export interface CommentDTO {
    path: string;
    action: Action;
    date: Date;
    username: string;
}