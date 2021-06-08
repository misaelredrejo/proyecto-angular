import { Injectable } from '@angular/core';
import * as configuracionNPRJSON from '../../assets/configuracionNPR.json';
import * as modelosDFJSON from '../../assets/modelosDF.json';
import { ModeloDF } from '../models/modelo-df.model.js';

@Injectable()
export class Globals {
    menuProfesional: {}[];
    esquema: {};
    literaleses: {};
    literaleseu: {};
    modelosDF: ModeloDF[];

    constructor() {
        this.menuProfesional = configuracionNPRJSON.menuProfesional;
        this.esquema = configuracionNPRJSON.esquema;
        this.literaleses = configuracionNPRJSON.literaleses;
        this.literaleseu = configuracionNPRJSON.literaleseu;
        this.modelosDF = modelosDFJSON['default'];
        this.modelosDF = this.modelosDF.map(val => <ModeloDF>{
            modelo: val['Modelo'],
            indice: val['Indice'],
            descripcion: val['Descripcion'],
            etiquetaRegistro: val['EtiquetaRegistro'],
            columnas: val['Columnas'],
            tiposColumnas: val['TiposColumnas'],
            columnaDNI: val['ColumnaDNI'],
            columnasExcluidas: val['ColumnasExcluidas'],
            excluir: val['Excluir']
          });
        /*this.modelosDF = modelosDFJSON.map(val => <ModeloDF>{
            modelo: val.Modelo,
            indice: val.Indice,
            descripcion: val.Descripcion,
            etiquetaRegistro: val.EtiquetaRegistro,
            columnas: val.Columnas,
            tiposColumnas: val.TiposColumnas,
            columnaDNI: val.ColumnaDNI,
            columnasExcluidas: val.ColumnasExcluidas,
            excluir: val.Excluir
          });*/
          
    }
}