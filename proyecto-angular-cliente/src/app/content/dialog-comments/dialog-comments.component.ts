import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import { Comment } from 'src/app/models/comment.model'
import { Action, Status } from 'src/app/models/enums.model';
import { User } from 'src/app/models/user.model';
import { Log } from 'src/app/models/log.model';
import { DialogDataComments } from 'src/app/models/dialog-data-comments.model';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';


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
    private authService: AuthenticationService,
    private spinnerService: SpinnerService
  ) {
    this.formAdd = this.fb.group({
      comment: ['', Validators.required]
    });
    this.formEdit = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
    });
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

  addComment(formDirective: FormGroupDirective) {
    if (this.formAdd.valid) {
      let text: string = this.formAdd.get('comment').value;
      let comment: Comment = {
        commentId: 0,
        path: this.data.path,
        text: text,
        isActive: true
      };
      this.spinnerService.show();      
      this.apiService.addCommentAsync(comment).subscribe(data => {
        switch (data.status) {
          case Status.Success:
            formDirective.resetForm();
            let comment: Comment = data.data;
            let log: Log = {
              logId: 0,
              commentId: comment.commentId,
              user: this.user,
              date: new Date(),
              action: Action.Aniadir
            }
            this.data.commentList.push(comment);
            this.addLog(log);
            this.toastr.success(data.message, 'ATENCIÓN');
            break;
          case Status.NotFound:
            this.toastr.error(data.message, 'ERROR');
            this.spinnerService.hide();
            break;
          case Status.Error:
            this.toastr.error(data.message, 'ERROR');
            this.spinnerService.hide();
            break;
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
      this.formAdd.reset();
    } else {
      this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
    }

  }

  editComment() {
    if (this.formEdit.valid) {
      let comment: Comment = Object.assign({}, this.data.commentList[this.indexComment]);
      let text: string = this.formEdit.get('comment').value;
      comment.text = text;
      this.spinnerService.show();
      this.apiService.updateCommentAsync(comment.commentId, comment).subscribe(data => {
        switch (data.status) {
          case Status.Success:
            let log: Log = {
              logId: 0,
              commentId: comment.commentId,
              user: this.user,
              date: new Date(),
              action: Action.Modificar
            };
            this.data.commentList[this.indexComment] = comment;
            this.indexComment = undefined;
            this.addLog(log);
            this.toastr.success(data.message, 'ATENCIÓN');
            break;
          case Status.NotFound:
            this.toastr.error(data.message, 'ERROR');
            this.spinnerService.hide();
            break;
          case Status.Error:
            this.toastr.error(data.message, 'ERROR');
            this.spinnerService.hide();
            break;
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
    } else {
      this.toastr.error('El comentario no puede estar vacío.', 'ERROR');
    }

  }

  deleteComment(index: number) {
    let comment: Comment = Object.assign({}, this.data.commentList[index]);
    comment.isActive = false;
    this.spinnerService.show();
    this.apiService.updateCommentAsync(comment.commentId, comment).subscribe(data => {
      switch (data.status) {
        case Status.Success:
          let log: Log = {
            logId: 0,
            commentId: comment.commentId,
            user: this.user,
            date: new Date(),
            action: Action.Eliminar
          };
          this.data.commentList[index] = comment;
          this.addLog(log);
          this.toastr.success(data.message, 'ATENCIÓN');
          break;
        case Status.NotFound:
          this.toastr.error(data.message, 'ERROR');
          this.spinnerService.hide();
          break;
        case Status.Error:
          this.toastr.error(data.message, 'ERROR');
          this.spinnerService.hide();
          break;
      }
    }, err => {
      console.log(err);
      this.spinnerService.hide();
    });
  }

  activateComment(index: number) {
    let comment: Comment = Object.assign({}, this.data.commentList[index]);
    comment.isActive = true;
    this.spinnerService.show();
    this.apiService.updateCommentAsync(comment.commentId, comment).subscribe(data => {
      switch (data.status) {
        case Status.Success:
          let log: Log = {
            logId: 0,
            commentId: comment.commentId,
            user: this.user,
            date: new Date(),
            action: Action.Activar
          };
          this.data.commentList[index] = comment;
          this.addLog(log);
          this.toastr.success(data.message, "ATENCIÓN");
          break;
        case Status.NotFound:
          this.toastr.error(data.message, 'ERROR');
          this.spinnerService.hide();
          break;
        case Status.Error:
          this.toastr.error(data.message, 'ERROR');
          this.spinnerService.hide();
          break;
      }
    }, err => {
      this.spinnerService.hide();
    });
  }

  addLog(log: Log): void {
    this.apiService.addLogAsync(log).subscribe(data => {
      switch (data.status) {
        case Status.NotFound:
          this.toastr.error(data.message, 'ERROR');
          break;
        case Status.Error:
          this.toastr.error(data.message, 'ERROR');
          break;
      }
      this.spinnerService.hide();
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

}
