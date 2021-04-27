import { Component, OnInit, Inject } from '@angular/core';
import { Rol } from 'src/app/shared/enums.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  rol: string;
}

@Component({
  selector: 'app-dialog-rol',
  templateUrl: './dialog-rol.component.html',
  styleUrls: ['./dialog-rol.component.css']
})
export class DialogRolComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogRolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {} 

  ngOnInit(): void {
  }

}
