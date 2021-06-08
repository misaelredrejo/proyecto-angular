import { Component, OnInit } from '@angular/core';
import { Globals } from '../shared/globals';
import { ModeloDF } from '../models/modelo-df.model';

@Component({
  selector: 'app-content-modelos-df',
  templateUrl: './content-modelos-df.component.html',
  styleUrls: ['./content-modelos-df.component.css']
})
export class ContentModelosDFComponent implements OnInit {

  modelosDF: ModeloDF[] = [];

  constructor(globals: Globals) { 
    this.modelosDF = globals.modelosDF;
  }

  ngOnInit(): void {
    console.log(this.modelosDF);
  }

}
