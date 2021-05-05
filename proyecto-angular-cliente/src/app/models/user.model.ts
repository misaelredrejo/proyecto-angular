import { Rol } from './enums.model';

export interface User {
    userId: number;
    username?: string;
    rol: Rol;
}
