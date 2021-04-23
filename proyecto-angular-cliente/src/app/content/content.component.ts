import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../shared/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { DialogCommentsComponent } from './dialog-comments/dialog-comments.component';
import { Comentario } from '../shared/comentario.model';


interface EsquemaNode {
  name: string;
  literal: string;
  children?: EsquemaNode[];
  esquema?: any;
  comentarios?: Comentario[];
  cntComentarios?: number;
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ContentComponent implements OnInit {
  link: string;
  literaleses: any[] = [];
  literaleseu: any[] = [];
  todoEsquema: any[] = [];
  esquema: any[] = [];
  literal: string;
  literaleu: string;

  treeControl = new NestedTreeControl<EsquemaNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<EsquemaNode>();


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
  }
  hasChild = (_: number, node: EsquemaNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {

    this.apiService
      .getJSON()
      .subscribe(
        data => {
          this.literaleses = data["literaleses"];
          this.literaleseu = data["literaleseu"];
          this.todoEsquema = data["esquema"];

          this.route.params.subscribe(params => {
            this.link = params['link'];
            this.literal = (this.literaleses[this.link] ? this.literaleses[this.link] : this.literaleses[this.link.toLowerCase()]);
            this.literaleu = (this.literaleseu[this.link] ? this.literaleseu[this.link] : this.literaleseu[this.link.toLowerCase()]);
            this.esquema = this.todoEsquema[this.link];
            let dataInsert: EsquemaNode[] = []

            let obj: EsquemaNode = { name: this.link, esquema: this.esquema, literal: this.literal};

            
            if (this.esquema['properties']) {
              dataInsert = this.getChildren(this.esquema['properties']);
            } else if (this.esquema['allOf']){
              dataInsert = this.getChildren(this.esquema['allOf'], true);
            } else {
              
              this.apiService.getCommentsByPath(this.esquema['path']).subscribe(data => {
                obj.comentarios = data;
              }, error => {
                console.log(error);
              });
              dataInsert.push(obj);
            }
            this.dataSource.data = dataInsert;
          });

        },
        err => {
          console.log(err);
        }
      );
  }

  getChildren(properties: any, containsAllOf = false) {
    let children: EsquemaNode[] = [];
    if (containsAllOf) {
      for (let key in properties) {
        let value = properties[key];
        let key1 = value['$ref'].substring(2);
        let literal = (this.literaleses[key1] ? this.literaleses[key1] : this.literaleses[key1.toLowerCase()]);

        let obj: any = {};
        obj.name = key1;
        obj.literal = literal;
        obj.comentarios = [];
        this.apiService.getCommentsByPath(this.todoEsquema[key1]['path']).subscribe(data => {
          obj.comentarios = data;
        }, error => {
          console.log(error);
        });
        this.apiService.getCntCommentsSubPath(this.todoEsquema[key1]['path']).subscribe(data => {
          obj.cntComentarios = data;
        }, error => {
          console.log(error);
        });

        if (this.todoEsquema[key1]['properties']) {
          obj.children = this.getChildren(this.todoEsquema[key1]['properties']);
          children.push(obj);
        } else if (this.todoEsquema[key1]['allOf']) {
          obj.children = this.getChildren(this.todoEsquema[key1]['allOf'], true);
          children.push(obj);
        } else {
          obj.esquema = this.todoEsquema[key1];
          
          children.push(obj);
        }
      }
    } else {
      for (let key in properties) {
        let literal = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);

        let obj: any = {};
        obj.name = key;
        obj.literal = literal;
        obj.comentarios = [];
        this.apiService.getCommentsByPath(this.todoEsquema[key]['path']).subscribe(data => {
          obj.comentarios = data;
        }, error => {
          console.log(error);
        });
        this.apiService.getCntCommentsSubPath(this.todoEsquema[key]['path']).subscribe(data => {
          obj.cntComentarios = data;
        }, error => {
          console.log(error);
        });

        if (this.todoEsquema[key]['properties']) {
          obj.children = this.getChildren(this.todoEsquema[key]['properties']);
          children.push(obj);
        } else if (this.todoEsquema[key]['allOf']) {
          obj.children = this.getChildren(this.todoEsquema[key]['allOf'], true);
          children.push(obj);
        } else {
          obj.esquema = this.todoEsquema[key];
          children.push(obj);
        }
      }
    }

    return children;
  }

  openDialog(listaComentarios: Comentario[], ruta: string) {
    this.dialog.open(DialogCommentsComponent, {
      data: {
        listaComentarios: listaComentarios,
        ruta: ruta
      }
    });
  }


}
