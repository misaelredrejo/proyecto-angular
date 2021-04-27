import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/api.service';
import { Comment } from 'src/app/shared/comment.model'
import { Action, Rol } from 'src/app/shared/enums.model';
import { User } from 'src/app/shared/user.model';
import { Log } from 'src/app/shared/log.model';


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

  user: User = {
    userId: 1,
    username: "Misael",
    rol: Rol.Desarrollador
  }

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


  allowEditComment(index: number) {
    this.formEdit.patchValue({
      comment: this.data.commentList[index]['text']
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
    let comment: Comment = {
      commentId: 0,
      path: this.data.path,
      text: text,
      logs: [{
        logId: 0,
        user: this.user,
        date: new Date(),
        action: Action.Añadir
      }
      ],
      isActive: true
    };

    this.apiService.addComment(comment).subscribe(data => {
      this.data.commentList.push(data);
      this.formAdd.reset();
      this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
    }, error => {
      console.log(error);
      this.toastr.error('Error al añadir comentario.', 'ERROR');
    });
  }

  editComment() {
    let comment: Comment = Object.assign({}, this.data.commentList[this.indexComment]);
      let text: string = this.formEdit.get('comment').value;
      if (text.length == 0) {
        this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
        return;
      }
      let log: Log = {
        logId: 0,
        user: this.user,
        date: new Date(),
        action: Action.Modificar
      }
      comment.logs.push(log);
      comment.text = text;
    this.apiService.updateComment(comment.commentId, comment).subscribe(data => {
      this.toastr.success('Comentario editado correctamente', 'Editar comentario');
      this.data.commentList[this.indexComment] = comment;
      this.canEditComment = false;
      this.indexComment = undefined;
    }, error => {
      console.log(error);
      this.toastr.error('Error al editar comentario.', 'ERROR');
    });
  }

  deleteComment(index: number) {
    
    let comment: Comment = Object.assign({}, this.data.commentList[index]);
    let log: Log = {
      logId: 0,
      user: this.user,
      date: new Date(),
      action: Action.Eliminar
    };
    comment.logs.push(log);
    comment.isActive = false;
      this.apiService.deleteComment(comment.commentId, comment).subscribe(data => {
        this.data.commentList[index] = comment;
        this.toastr.success('Comentario eliminado correctamente', 'Eliminar comentario');
      },
        error => {
          console.log(error);
          this.toastr.error('Error al eliminar comentario.', 'ERROR');
        });
    this.canEditComment = false;
  }

  activateComment(index: number) {
    
    let comment: Comment = Object.assign({}, this.data.commentList[index]);
    let log: Log = {
      logId: 0,
      user: this.user,
      date: new Date(),
      action: Action.Activar
    };
    comment.logs.push(log);
    comment.isActive = true;
      this.apiService.activateComment(comment.commentId, comment).subscribe(data => {
        this.data.commentList[index] = comment;
        this.toastr.success('Comentario activado correctamente', 'Activar comentario');
      },
        error => {
          console.log(error);
          this.toastr.error('Error al activar comentario.', 'ERROR');
        });
    this.canEditComment = false;
  }


}
