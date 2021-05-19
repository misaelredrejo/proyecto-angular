import { Comment } from './comment.model';
export interface EsquemaNode {
    name?: string;
    literal?: string;
    literaleu?:string;
    children?: EsquemaNode[];
    esquema?: any;
    comentarios?: Comment[];
    cntComentarios?: number;
    tableItems?: any[];
  }