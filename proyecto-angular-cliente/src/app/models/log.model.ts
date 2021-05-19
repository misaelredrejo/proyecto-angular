import { Action } from './enums.model';
import { User } from './user.model';

export interface Log {
    logId: number;
    commentId: number;
    user: User;
    date: Date;
    action: Action;
}
