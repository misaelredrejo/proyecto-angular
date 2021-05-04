import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/api.service';
import { Comment } from 'src/app/models/comment.model'
import { Action} from 'src/app/models/enums.model';
import { User } from 'src/app/models/user.model';
import { Log } from 'src/app/models/log.model';
import { DialogDataComments } from 'src/app/models/dialog-data-comments.model';
import { SpinnerService } from 'src/app/shared/spinner.service';


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
  showSpinner: boolean;

  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataComments,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private apiService: ApiService,
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

    this.spinnerService.visibility.subscribe(data => {
      this.showSpinner = data;
      console.log(this.showSpinner);
    })

    this.apiService.getUsername().subscribe(data => {
      this.apiService.getUser(data).subscribe(data1 => {
        this.user = data1;
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
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
    this.canEditComment = true;
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
        this.data.commentList.push(data);
        this.formAdd.reset();
        this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
      }, error => {
        console.log(error);
        this.toastr.error('Error al añadir comentario.', 'ERROR');
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
        this.toastr.success('Comentario editado correctamente', 'Editar comentario');
        this.data.commentList[this.indexComment] = comment;
        this.canEditComment = false;
        this.indexComment = undefined;
      }, error => {
        console.log(error);
        this.toastr.error('Error al editar comentario.', 'ERROR');
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
