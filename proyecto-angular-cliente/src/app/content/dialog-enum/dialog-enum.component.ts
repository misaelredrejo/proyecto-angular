import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataEnum } from 'src/app/models/dialog-data-enum.model';
import { Globals } from 'src/app/shared/globals';



@Component({
  selector: 'app-dialog-enum',
  templateUrl: './dialog-enum.component.html',
  styleUrls: ['./dialog-enum.component.css']
})
export class DialogEnumComponent implements OnInit {

  literaleses: {} = {};
  literaleseu: {} = {};
  enumLiteralList: string[] = [];

  constructor(
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEnum
  ) {
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
  }

  ngOnInit(): void {
    for (var i = 0; i < this.data.enumList.length; i++) {
      let codigo = this.data.codigo + '_' + this.data.enumList[i];
      let literalEs = this.literaleses[codigo];
      let literalEu = this.literaleseu[codigo];
      this.enumLiteralList.push(codigo + ' - ' + literalEs + ' - ' + literalEu);
    }
  }

}
