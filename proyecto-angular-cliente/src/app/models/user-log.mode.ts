import { User } from './user.model';
import { Log } from './log.model';

export interface UserLog {
    userLogId: number;
    user: User
    log: Log;
}