import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../shared/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { DialogCommentsComponent } from './dialog-comments/dialog-comments.component';
import { Comment } from 'src/app/models/comment.model';
import { DialogEnumComponent } from './dialog-enum/dialog-enum.component';
import { Rol } from '../models/enums.model';
import { TitleService } from '../shared/title.service';
import { EsquemaNode } from '../models/esquema-node.model';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';




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
  user:User;

  link: string;
  literaleses: string[] = [];
  literaleseu: string[] = [];
  todoEsquema: any[] = [];
  esquema: any[] = [];
  literal: string;
  literaleu: string;

  TABLE_COLS = ['type', 'format', 'minimum', 'maximum', 'minLength', 'maxLength', 'enum', 'expandible', 'readOnly', 'multipleOf', 'required', 'path'];
  TABLE_NUM_COLS = ['type',"minimum", "maximum",  "path", "readOnly", "format","expandible"];
  TABLE_STR_COLS = ['type',"minLength","maxLength", "enum", "path", "format", "readOnly", "required", "multipleOf", "expandible"];

  treeControl = new NestedTreeControl<EsquemaNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<EsquemaNode>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private titleService: TitleService,
    private authService: AuthenticationService
  ) {

  }
  hasChild = (_: number, node: EsquemaNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {

    this.checkUser();

    this.loadJSON();

    
  }

  checkUser(): void {
    this.user = this.authService.currentUserValue;
    if (this.user.rol == Rol.Desarrollador) {
      this.TABLE_COLS.splice(7, 1);
      this.TABLE_NUM_COLS.splice(6, 1);
      this.TABLE_STR_COLS.splice(9, 1);
    }
  }

  loadJSON(): void {
    this.apiService
    .getJSON()
    .subscribe(
      data => {
        this.literaleses = data["literaleses"];
        this.literaleseu = data["literaleseu"];
        this.todoEsquema = data["esquema"];

        this.route.params.subscribe(params => {
          this.link = params['link'];
          this.esquema = this.todoEsquema[this.link];
          if (this.esquema == null) {
            this.router.navigate(['/404']);
            return;
          }
          this.literal = (this.literaleses[this.link] ? this.literaleses[this.link] : this.literaleses[this.link.toLowerCase()]);
          this.literaleu = (this.literaleseu[this.link] ? this.literaleseu[this.link] : this.literaleseu[this.link.toLowerCase()]);
          
          this.titleService.changeTitle(this.link + ' - ' + this.literal + ' - ' + this.literaleu);
          let dataInsert: EsquemaNode[] = [];
          
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
    let tableItems: any[] = [];
    let tableNumberItems: any[] = [];
    let tableStringItems: any[] = [];
    if (containsAllOf) {
      for (let key in properties) {
        let value = properties[key];
        let key1 = value['$ref'].substring(2);
        let literal = (this.literaleses[key1] ? this.literaleses[key1] : this.literaleses[key1.toLowerCase()]);
        let literaleu = (this.literaleseu[key1] ? this.literaleseu[key1] : this.literaleseu[key1.toLowerCase()]);
        let esquema = this.todoEsquema[key1];
        let obj: any = {};
        obj.name = key1;
        obj.literal = literal;
        obj.literaleu = literaleu;
        obj.comentarios = [];
        obj.esquema = esquema;
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
          tableItems.push(obj);
          if (obj.esquema['type'] == 'number') {
            tableNumberItems.push(obj);
          }else if (obj.esquema['type'] == 'string') {
            tableStringItems.push(obj);
          }
        }
      }
    } else {
      for (let key in properties) {
        let literal = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
        let literaleu = (this.literaleseu[key] ? this.literaleseu[key] : this.literaleseu[key.toLowerCase()]);

        let obj: any = {};
        let esquema = this.todoEsquema[key];
        obj.name = key;
        obj.literal = literal;
        obj.literaleu = literaleu;
        obj.esquema = esquema;
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
          tableItems.push(obj);
          if (obj.esquema['type'] == 'number') {
            tableNumberItems.push(obj);
          }else if (obj.esquema['type'] == 'string') {
            tableStringItems.push(obj);
          }
        }
      }
    }
    if (tableItems.length > 0) children.push({tableItems: tableItems, tableString: tableStringItems, tableNumber: tableNumberItems});
    return children;
  }

  openDialog(commentList: Comment[], path: string) {
    this.dialog.open(DialogCommentsComponent, {
      data: {
        commentList: commentList,
        path: path
      }
    });
  }

  openDialogEnumList(codigo:string, enumList: any[]) {
    this.dialog.open(DialogEnumComponent, {
      data: {
        codigo: codigo,
        enumList: enumList,
        literaleses: this.literaleses,
        literaleseu: this.literaleseu
      }
    });
  }


}
