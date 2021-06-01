import { Comment } from './comment.model';
import { UserLog } from './user-log.mode';
export interface EsquemaNode {
    name?: string;
    literal?: string;
    literaleu?:string;
    children?: EsquemaNode[];
    esquema?: any;
    comentarios?: Comment[];
    cntComentariosSubpath?: number;
    cntComentariosActivos?: number;
    tableItems?: any[];
    hasUnreadLogs?: boolean;
  }