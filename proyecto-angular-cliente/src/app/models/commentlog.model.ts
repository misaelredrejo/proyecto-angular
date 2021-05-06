import { Action } from './enums.model';


export interface CommentLog {
    path: string;
    action: Action;
    date: Date;
    username: string;
}