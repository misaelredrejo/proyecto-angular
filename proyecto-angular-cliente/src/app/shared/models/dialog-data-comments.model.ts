import { Comment } from 'src/app/shared/models/comment.model';

export interface DialogDataComments {
    commentList: Comment[];
    path: string;
  }