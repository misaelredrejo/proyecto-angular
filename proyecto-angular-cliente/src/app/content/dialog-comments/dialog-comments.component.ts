import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import { Comment } from 'src/app/models/comment.model'
import { Action, Status } from 'src/app/models/enums.model';
import { User } from 'src/app/models/user.model';
import { Log } from 'src/app/models/log.model';
import { DialogDataComments } from 'src/app/models/dialog-data-comments.model';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';


@Component({
  selector: 'app-dialog-comments',
  templateUrl: './dialog-comments.component.html',
  styleUrls: ['./dialog-comments.component.css']
})
export class DialogCommentsComponent implements OnInit {

  formAdd: FormGroup;
  formEdit: FormGroup;
  indexComment: number | undefined;

  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataComments,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
    this.formAdd = this.fb.group({
      comment: ['', Validators.required]
    });
    this.formEdit = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
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
  }

  addComment() {
    if (this.formAdd.valid) {
      let text: string = this.formAdd.get('comment').value;
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
        switch (data.status) {
          case Status.Success:
            this.data.commentList.push(data.data);
            this.formAdd.reset();
            this.toastr.success(data.message, 'Añadir comentario');
            break;
          case Status.NotFound:
            this.toastr.error(data.message, 'ERROR');
            break;
          case Status.Error:
            this.toastr.error('No se pudo añadir el comentario.', 'ERROR');
            console.log(data.message);
            break;
        }

      });
    } else {
      this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
    }

  }

  editComment() {

    if (this.formEdit.valid) {
      let comment: Comment = Object.assign({}, this.data.commentList[this.indexComment]);
      let text: string = this.formEdit.get('comment').value;
      let log: Log = {
        logId: 0,
        user: this.user,
        date: new Date(),
        action: Action.Modificar
      }
      comment.logs.push(log);
      comment.text = text;
      this.apiService.updateComment(comment.commentId, comment).subscribe(data => {
        switch (data.status) {
          case Status.Success:
            this.toastr.success(data.message, 'Editar comentario');
            this.data.commentList[this.indexComment] = comment;
            this.indexComment = undefined;
            break;
          case Status.NotFound:
            this.toastr.error(data.message, 'ERROR');
            break;
          case Status.Error:
            this.toastr.error('No se pudo editar el comentario.', 'ERROR');
            console.log(data.message);
            break;
        }
      });
    } else {
      this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
    }

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
      switch (data.status) {
        case Status.Success:
            this.data.commentList[index] = comment;
            this.toastr.success(data.message, 'Eliminar comentario');
          break;
        case Status.NotFound:
            this.toastr.success(data.message, 'ERROR');
          break;
        case Status.Error:
            console.log(data.message);
            this.toastr.error('Error al eliminar comentario.', 'ERROR');
          break;
      }
      
    });
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
      switch (data.status) {
        case Status.Success:
            this.data.commentList[index] = comment;
            this.toastr.success(data.message, 'Activar comentario');
          break;
        case Status.NotFound:
            this.toastr.success(data.message, 'ERROR');
          break;
          case Status.Error:
              console.log(data.message);
              this.toastr.error('Error al activar comentario.', 'ERROR');
            break;
      }
      
    });
  }


}
