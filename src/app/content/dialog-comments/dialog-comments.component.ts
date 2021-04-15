import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  comments: any[];
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
      this.data.comments.push(this.formAdd.get('comment').value);
      this.formAdd.reset();
      this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
    } else {
      // Editar comentario
      this.data.comments[this.indexComment] = this.formEdit.get('comment').value;
      this.canEditComment = false;

      this.indexComment = undefined;
      this.toastr.info('Comentario editado correctamente.', 'Editar comentario');
    }
    
  }
  

  editComment(index: number) {
    this.formEdit.patchValue({
      comment: this.data.comments[index]
    });
    this.indexComment = index;
    this.canEditComment = true;
  }

  deleteComment(index: number) {
    this.data.comments.splice(index, 1);
    this.toastr.error('Comentario eliminado correctamente.', 'Eliminar comentario');
  }

}
