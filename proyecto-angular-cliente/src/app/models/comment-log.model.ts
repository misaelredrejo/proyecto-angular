import { Action } from './enums.model';


export interface CommentLog {
    commentText: string;
    path: string;
    action: Action;
    date: Date;
    username: string;
}