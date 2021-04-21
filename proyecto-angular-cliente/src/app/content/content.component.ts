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
  todoEsquema: any[] = [];
  esquema: any[] = [];
  literal: string;

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
          this.todoEsquema = data["esquema"];

          this.route.params.subscribe(params => {
            this.link = params['link'];
            this.literal = (this.literaleses[this.link] ? this.literaleses[this.link] : this.literaleses[this.link.toLowerCase()]);
            this.esquema = this.todoEsquema[this.link];
            let dataInsert: EsquemaNode[] = []
            if (this.esquema['properties']) {
              dataInsert = this.getChildren(this.esquema['properties']);
            } else if (this.esquema['allOf']){
              dataInsert = this.getChildren(this.esquema['allOf'], true);
            } else {
              let obj = { name: this.link, esquema: this.esquema, literal: this.literal, comentarios: []};
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
        if (this.todoEsquema[key1]['properties']) {
          children.push({ name: key1, children: this.getChildren(this.todoEsquema[key1]['properties']), literal: literal });
        } else if (this.todoEsquema[key1]['allOf']) {
          children.push({ name: key1, children: this.getChildren(this.todoEsquema[key1]['allOf'], true), literal: literal });
        } else {
          let obj = { name: key1, esquema: this.todoEsquema[key1], literal: literal, comentarios: []};
          this.apiService.getCommentsByPath(this.todoEsquema[key1]['path']).subscribe(data => {
            obj.comentarios = data;
          }, error => {
            console.log(error);
          });
          children.push(obj);
        }
      }
    } else {
      for (let key in properties) {
        let literal = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
        if (this.todoEsquema[key]['properties']) {
          children.push({ name: key, children: this.getChildren(this.todoEsquema[key]['properties']), literal: literal });
        } else if (this.todoEsquema[key]['allOf']) {
          children.push({ name: key, children: this.getChildren(this.todoEsquema[key]['allOf'], true), literal: literal });
        } else {
          let obj = { name: key, esquema: this.todoEsquema[key], literal: literal, comentarios: []}
          this.apiService.getCommentsByPath(this.todoEsquema[key]['path']).subscribe(data => {
            obj.comentarios = data;
          }, error => {
            console.log(error);
          });
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
