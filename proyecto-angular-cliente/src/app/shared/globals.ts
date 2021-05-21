import { Injectable } from '@angular/core';
import * as data from '../../assets/configuracionNPR.json';

@Injectable()
export class Globals {
    menuProfesional: {}[];
    esquema: {};
    literaleses: {};
    literaleseu: {};

    constructor() {
        this.menuProfesional = data.menuProfesional;
        this.esquema = data.esquema;
        this.literaleses = data.literaleses;
        this.literaleseu = data.literaleseu;
    }
}