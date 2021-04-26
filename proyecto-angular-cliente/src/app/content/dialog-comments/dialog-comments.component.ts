import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/api.service';
import {Comment} from 'src/app/shared/comment.model'
import { Action, Rol } from 'src/app/shared/enums.model';
import { User } from 'src/app/shared/user.model';


export interface DialogData {
  commentList: Comment[];
  path: string;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.formAdd = this.fb.group({
      comment: ['']
    });
    this.formEdit = this.fb.group({
      comment: ['']
    });
  }

  ngOnInit(): void {
  }

  // Workaround for angular component issue #13870
  disableAnimation = true;
  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }


  saveComment() {

    if (this.indexComment == undefined) {
      // Agregar nuevo comentario
      let text: string = this.formAdd.get('comment').value;
      if (text == null || text.length == 0) {
        this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
        return;
      }

    } else {
      // Editar comentario
      let comentario: Comment = this.data.commentList[this.indexComment];
      let texto: string = this.formEdit.get('comment').value;
      if (texto.length == 0) {
        this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
        return;
      }
      //comentario.texto = this.formEdit.get('comment').value;



    }

  }


  allowEditComment(index: number) {
    this.formEdit.patchValue({
      comment: this.data.commentList[index]['texto']
    });
    this.indexComment = index;
    this.canEditComment = true;
  }

  addComment() {
    let text: string = this.formAdd.get('comment').value;
    if (text == null || text.length == 0) {
      this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
      return;
    }
let user: User = {
  userId: 1,
  username: "Misael",
  rol: Rol.Desarrollador
}
    let comment: Comment = {
      commentId: 0,
      path: this.data.path,
      text: text,
      logs: [{
        logId: 0,
        user: user,
        date: new Date(),
        action: Action.Añadir
      }
      ],
      isActive: true
    }; /*
    {
      id: 0,
      user: {id: 1, username: "Misael", rol: 0},
      date: new Date(),
      action: Action.Añadir
    }*/

    this.apiService.addComment(comment).subscribe(data => {
      this.data.commentList.push(data);
      this.formAdd.reset();
      this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
    }, error => {
      console.log(error);
      this.toastr.error('Error al añadir comentario.', 'ERROR');
    });
  }

  editComment(comment: Comment) {
    this.apiService.updateComment(1, comment).subscribe(data => {
      this.toastr.success('Comentario editado correctamente', 'Editar comentario');
      this.data.commentList[this.indexComment] = data;
      this.canEditComment = false;
      this.indexComment = undefined;
    }, error => {
      console.log(error);
      this.toastr.error('Error al editar comentario.', 'ERROR');
    });
  }

  deleteComment(index: number) {
    /*
    let id = this.data.listaComentarios[index].id;
    let comentario: Comment = this.data.listaComentarios[index];
    this.apiService.getUser().subscribe(data => {
      comentario.usuario = data;

      this.apiService.deleteComment(id, comentario).subscribe(data => {
        this.data.listaComentarios.splice(index, 1);
        this.toastr.success(data['message'], 'Eliminar comentario');
      },
        error => {
          console.log(error);
          this.toastr.error('Error al eliminar comentario.', 'ERROR');
        });
    }, error => {
      console.log(error);
    });
    this.canEditComment = false;*/


  }

}
