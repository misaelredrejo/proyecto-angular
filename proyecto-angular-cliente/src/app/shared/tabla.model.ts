export interface Tabla {
    type: string;
    format?: string;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    enum?: string[];
    expandible?: boolean;
    readOnly?: boolean;
    multipleOf?: number;
    required?: string[];
    path: string;
}
