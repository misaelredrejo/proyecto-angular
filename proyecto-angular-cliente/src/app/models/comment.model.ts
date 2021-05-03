import { Log } from './log.model';

export interface Comment {
    commentId: number;
    path: string;
    text: string;
    logs: Log[];
    isActive: boolean;
}
