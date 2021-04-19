import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comentario } from 'src/app/shared/comentario.model';


export interface DialogData {
  listaComentarios: Comentario[];
}


@Component({
  selector: 'app-dialog-comments',
  templateUrl: './dialog-comments.component.html',
  styleUrls: ['./dialog-comments.component.css']
})
export class DialogCommentsComponent implements OnInit {
 

  canEditComment = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  indexComment: number | undefined;

  ngOnInit(): void {
  }

  // Workaround for angular component issue #13870
  disableAnimation = true;
  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService, private fb: FormBuilder) {
    this.formAdd = this.fb.group({
      comment: ['']
    });
    this.formEdit = this.fb.group({
      comment: ['']
    });
   }

  saveComment() {

    if (this.indexComment == undefined) {
      // Agregar nuevo comentario
      this.data.listaComentarios.push({
          id: 0,
          idComentario: 0,
          usuario: "Pepe", ruta:"/path/x",
          texto: this.formAdd.get('comment').value,
          fechaBaja: new Date(),
          fechaAlta: null
        });
      this.formAdd.reset();
      this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
    } else {
      // Editar comentario
      this.data.listaComentarios[this.indexComment]['texto'] = this.formEdit.get('comment').value;
      this.canEditComment = false;

      this.indexComment = undefined;
      this.toastr.info('Comentario editado correctamente.', 'Editar comentario');
    }
    
  }
  

  editComment(index: number) {
    this.formEdit.patchValue({
      comment: this.data.listaComentarios[index]['texto']
    });
    this.indexComment = index;
    this.canEditComment = true;
  }

  deleteComment(index: number) {
    this.data.listaComentarios.splice(index, 1);
    this.toastr.error('Comentario eliminado correctamente.', 'Eliminar comentario');
  }

}
