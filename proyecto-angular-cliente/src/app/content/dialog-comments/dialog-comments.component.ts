import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comentario } from 'src/app/shared/comentario.model';
import { ApiService } from 'src/app/shared/api.service';


export interface DialogData {
  listaComentarios: Comentario[];
  ruta: string;
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
      this.apiService.getNextIdComentario().subscribe(data => {
        let comentario: Comentario = {
          id: 0,
          idComentario: data,
          usuario: "",
          ruta: this.data.ruta,
          texto: this.formAdd.get('comment').value,
          fechaAlta: new Date(),
          fechaBaja: null
        }

        this.apiService.getUser().subscribe(data => {
          comentario.usuario = data;
          this.addComment(comentario);
        }, error => {
          console.log(error);
        });

      });

    } else {
      // Editar comentario
      let comentario: Comentario = this.data.listaComentarios[this.indexComment];
      comentario.texto = this.formEdit.get('comment').value;

      this.editComment(comentario);

    }

  }


  allowEditComment(index: number) {
    this.formEdit.patchValue({
      comment: this.data.listaComentarios[index]['texto']
    });
    this.indexComment = index;
    this.canEditComment = true;
  }

  addComment(comentario: Comentario) {
    this.apiService.addComment(comentario).subscribe(data => {
      this.data.listaComentarios.push(data);
      this.formAdd.reset();
      this.toastr.success('Comentario añadido correctamente.', 'Añadir comentario');
    }, error => {
      console.log(error);
      this.toastr.error('Error al añadir comentario.', 'ERROR');
    });
  }

  editComment(comentario: Comentario) {
    this.apiService.updateComment(comentario.id, comentario).subscribe(data => {
      this.toastr.success(data['message'], 'Editar comentario');
      this.data.listaComentarios[this.indexComment] = comentario;
    }, error => {
      console.log(error);
      this.toastr.error('Error al editar comentario.', 'ERROR');
    });
    this.canEditComment = false;
    this.indexComment = undefined;
  }

  deleteComment(index: number) {
    let id = this.data.listaComentarios[index].id;
    let comentario: Comentario = this.data.listaComentarios[index];
    comentario.id = 0;
    comentario.fechaBaja = new Date();
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



  }

}
