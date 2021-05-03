import { Comment } from 'src/app/shared/models/comment.model';
export interface EsquemaNode {
    name?: string;
    literal?: string;
    literaleu?:string;
    children?: EsquemaNode[];
    esquema?: any;
    comentarios?: Comment[];
    cntComentarios?: number;
    tableItems?: any[];
    tableNumber?: any[];
    tableString?: any[];
  }