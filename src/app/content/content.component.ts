import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass', './content.component.css']
})
export class ContentComponent implements OnInit {

  link: string;
  literales: any[] = [];
  todoEsquema: any[] = [];
  literal: string;
  esquema: any[] = [];

  displayedColumns: string[] = ['name', 'value'];
  dataSource = [
    {name: "nombre1", value: "valor1"},
    {name: "nombre2", value: "valor2"}
  ];
  newDataSource = [];
  

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.apiService
          .getJSON()
          .subscribe(
            data => {
              this.literales = data["literales"];
              this.todoEsquema = data["esquema"];

              
              this.route.params.subscribe(params => {
                this.link = params['link'];
                this.literal = this.literales[this.link];
                this.esquema = this.todoEsquema[this.link];
                this.newDataSource = [];
                for (let [key, value] of Object.entries(this.esquema["properties"])) {
                  this.newDataSource.push({name: key, value: value["$ref"]});
                  
                }
                this.dataSource = this.newDataSource;
             });

            },
            err => {
              console.log(err);
            }
          );
    
    
  }
  
  async showAlertInsert(): Promise<void> {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Agregar comentario',
      inputPlaceholder: 'Mensaje...',
      inputAttributes: {
        'aria-label': 'Mensaje'
      },
      showCancelButton: true
    })
    
    if (text) {
      //Swal.fire(text)
      // Lo guardo
    }
  }


  showAlertComments() {
    Swal.fire({
      title: 'Comentarios',
      html: `
      -Blabla1
      <br/>
      -Blabla2
      `
    }
    );
  }

}
