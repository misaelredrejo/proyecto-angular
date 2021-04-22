import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Comentario } from '../shared/comentario.model';
import { ComentarioDTO } from '../shared/comentariodto-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  comentariosAccion: ComentarioDTO[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    
    this.apiService.getLast10Comments().subscribe(data => {
      this.comentariosAccion = data;
    }), error => {
      console.log(error);
    };

  }
 
}
