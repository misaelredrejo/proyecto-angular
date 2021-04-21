import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Comentario } from '../shared/comentario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: string;
  todosComentarios: Comentario[] = [];
  ultimosComentarios: Comentario[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    
    this.apiService.getUser().subscribe(data => {
      this.user = data;
    }, error => {
      console.log(error);
    });

    this.apiService.getComments().subscribe(data => {
      this.todosComentarios = data;
    }, error => {
      console.log(error);
    });
    
    this.apiService.getLast10Comments().subscribe(data => {
      this.ultimosComentarios = data;
    }), error => {
      console.log(error);
    };

  }

  comentarioBorrado(comentario: Comentario): boolean {
    let borrado = true;
    for (let i = 0; i < this.todosComentarios.length; i++) {
      if (this.todosComentarios[i].idComentario == comentario.idComentario && comentario.fechaBaja == null) {
        borrado = false;
      }
    }
    console.log(borrado);
    return borrado;
  }

  comentarioAniadido(comentario: Comentario): boolean {
    let aniadido = true;
    for (let i = 0; i < this.todosComentarios.length; i++) {
      if (this.todosComentarios[i].idComentario == comentario.idComentario && this.todosComentarios[i].id < comentario.id) {
        aniadido = false;
      }
    }
    return aniadido;
  }

}
