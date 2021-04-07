import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/api.service';
import Swal from 'sweetalert2';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ContentComponent implements OnInit {

  link: string;
  literales: any[] = [];
  todoEsquema: any[] = [];
  esquema: any[] = [];
  literal: string;
  displayedColumns: string[] = ['name', 'value'];
  columnsToDisplay: string[] = ['name', 'value'];
  dataSource = [
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
                  let ref:string = value['$ref'];
                  this.newDataSource.push({name: key, value: value["$ref"], detail: this.todoEsquema[ref.substring(2)]});
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
