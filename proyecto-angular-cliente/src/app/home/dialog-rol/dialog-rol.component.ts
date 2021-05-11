import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataRol } from 'src/app/models/dialog-data-rol.model';
import { Rol } from 'src/app/models/enums.model';



@Component({
  selector: 'app-dialog-rol',
  templateUrl: './dialog-rol.component.html',
  styleUrls: ['./dialog-rol.component.css']
})
export class DialogRolComponent implements OnInit {

  public rolTypes = Object.keys(Rol).map(k => Rol[k as any])
  rol = Rol;

  constructor(
    public dialogRef: MatDialogRef<DialogRolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataRol) {} 

  ngOnInit(): void {
  }

}
