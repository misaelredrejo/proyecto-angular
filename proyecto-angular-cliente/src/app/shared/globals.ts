import { Injectable } from '@angular/core';
import * as configuracionNPRJSON from '../../assets/configuracionNPR.json';
import {default as modelosDFJSON} from '../../assets/modelosDF.json';
import {default as nodosOrigenesDFJSON} from '../../assets/nodosOrigenesDF.json';
import {default as origenesDFJSON} from '../../assets/origenesDF.json';
import { ModeloDF } from '../models/modelo-df.model.js';
import { NodosOrigenDF } from '../models/nodos-origen-df.model.js';

@Injectable()
export class Globals {
    menuProfesional: {}[];
    esquema: {};
    literaleses: {};
    literaleseu: {};
    modelosDF: ModeloDF[];
    nodosOrigenesDF: NodosOrigenDF[];
    origenesDF: {};

    constructor() {
        this.menuProfesional = configuracionNPRJSON.menuProfesional;
        this.esquema = configuracionNPRJSON.esquema;
        this.literaleses = configuracionNPRJSON.literaleses;
        this.literaleseu = configuracionNPRJSON.literaleseu;
        
        this.modelosDF = modelosDFJSON.map(val => <ModeloDF>{
          modelo: val.Modelo,
          indice: val.Indice,
          descripcion: val.Descripcion,
          etiquetaRegistro: val.EtiquetaRegistro,
          columnas: val.Columnas.split(','),
          tiposColumnas: val.TiposColumnas.split(','),
          columnaDNI: val.ColumnaDNI,
          columnasExcluidas: val.ColumnasExcluidas.split(','),
          excluir: val.Excluir,
          origenesDF: []
        });

        this.nodosOrigenesDF = nodosOrigenesDFJSON.map(val => <NodosOrigenDF> {
          origen: val.Origen,
          nodos: val.Nodos.split(',')
        });

        this.origenesDF = origenesDFJSON;
    }
}