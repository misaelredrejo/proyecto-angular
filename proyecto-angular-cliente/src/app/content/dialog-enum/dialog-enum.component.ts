import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataEnum } from 'src/app/models/dialog-data-enum.model';



@Component({
  selector: 'app-dialog-enum',
  templateUrl: './dialog-enum.component.html',
  styleUrls: ['./dialog-enum.component.css']
})
export class DialogEnumComponent implements OnInit {

  enumLiteralList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEnum
  ) {
  }

  ngOnInit(): void {
    for (var i = 0; i < this.data.enumList.length; i++) {
      let literalEs = this.data.literaleses[this.data.codigo + '_' + this.data.enumList[i]];
      let literalEu = this.data.literaleseu[this.data.codigo + '_' + this.data.enumList[i]];
      this.enumLiteralList.push(literalEs + ' - ' + literalEu);
    }
  }

}
