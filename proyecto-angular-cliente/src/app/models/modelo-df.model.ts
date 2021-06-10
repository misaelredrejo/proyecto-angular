export interface ModeloDF {
    modelo: string;
    indice: number;
    descripcion: string;
    etiquetaRegistro: string;
    columnas: string[];
    tiposColumnas: string[];
    columnaDNI: string;
    columnasExcluidas: string[];
    excluir: false;
    origenDF?: {};
}