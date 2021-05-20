import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../shared/services/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { DialogCommentsComponent } from './dialog-comments/dialog-comments.component';
import { Comment } from 'src/app/models/comment.model';
import { DialogEnumComponent } from './dialog-enum/dialog-enum.component';
import { Rol, Status } from '../models/enums.model';
import { TitleService } from '../shared/services/title.service';
import { EsquemaNode } from '../models/esquema-node.model';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { SpinnerService } from '../shared/services/spinner.service';

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
  user: User;

  link: string;
  literaleses: string[] = [];
  literaleseu: string[] = [];
  todoEsquema: any[] = [];
  esquema: any[] = [];
  literal: string;
  literaleu: string;
  literalMaxLength: number = 50;

  ALL_TABLE_COLS = ['type', 'format', 'minimum', 'maximum', 'minLength', 'maxLength', 'enum', 'expandible', 'readOnly', 'multipleOf', 'required', 'path'];
  TABLE_COLS = ['type', 'format', 'minimum', 'maximum', 'minLength', 'maxLength', 'enum', 'expandible', 'readOnly', 'multipleOf', 'required', 'path'];
  COLS_HIDE = ['expandible', 'multipleOf', 'path'];
  treeControl = new NestedTreeControl<EsquemaNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<EsquemaNode>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private titleService: TitleService,
    private authService: AuthenticationService,
    private spinnerService: SpinnerService
  ) {

  }
  hasChild = (_: number, node: EsquemaNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.checkUser();
    //this.spinnerService.show();
    this.loadJSON();
  }

  checkUser(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
      if (this.user.rol != Rol.Desarrollador) {
        this.COLS_HIDE.forEach(col => {
          var index = this.TABLE_COLS.indexOf(col);
          if (index != -1) this.TABLE_COLS.splice(index, 1);
        });
      } else {
        this.TABLE_COLS = Object.assign([], this.ALL_TABLE_COLS);
      }
      if (this.titleService.currentTitleValue != 'Configuración NPR') {
        this.titleService.changeTitle((this.user.rol == Rol.Desarrollador ? this.link + ' - ' : '') + this.literal + ' - ' + this.literaleu);
      }
    }, error => {
      console.log(error);
    })
    
  }

  async loadJSON(): Promise<void> {

    await this.apiService.getJSONAsync().toPromise().then(result => {
      this.literaleses = result["literaleses"];
      this.literaleseu = result["literaleseu"];
      this.todoEsquema = result["esquema"];
    }).catch(err => {
      console.log(err);
    });

    this.subscribeParams();
  }


  subscribeParams() {
    this.route.params.subscribe(params => {
      this.link = params['link'];
      this.esquema = this.todoEsquema[this.link];
      if (this.esquema == null) {
        this.router.navigate(['/error/test']);
        return;
      }
      this.literal = (this.literaleses[this.link] ? this.literaleses[this.link] : this.literaleses[this.link.toLowerCase()]);
      this.literaleu = (this.literaleseu[this.link] ? this.literaleseu[this.link] : this.literaleseu[this.link.toLowerCase()]);
      if (this.user && this.user.rol == Rol.Desarrollador) {
        this.titleService.changeTitle(this.link + ' - ' + this.literal + ' - ' + this.literaleu);
      } else {
        this.titleService.changeTitle(this.literal + ' - ' + this.literaleu);
      }
      this.fillTree();
    });
  }

  fillTree() {
    let dataInsert: EsquemaNode[] = [];
    if (this.esquema['properties']) {
      dataInsert = this.getChildren(this.esquema['properties']);
    } else if (this.esquema['allOf']) {
      dataInsert = this.getChildren(this.esquema['allOf']);
    } else {
      dataInsert = this.getOnlyChild();
      this.loadLiteralParent();
    }
    this.dataSource.data = dataInsert;
    //this.spinnerService.hide();
  }

  getChildren(properties: any) {
    let children: EsquemaNode[] = [];
    let tableItems: any[] = [];
    for (let key in properties) {
      let value = properties[key];
      let code = value['$ref'].substring(2);
      let literal = (this.literaleses[code] ? this.literaleses[code] : this.literaleses[code.toLowerCase()]);
      let literaleu = (this.literaleseu[code] ? this.literaleseu[code] : this.literaleseu[code.toLowerCase()]);
      let esquema = this.todoEsquema[code];

      let node: EsquemaNode = {name: code, literal: literal, literaleu: literaleu, esquema: esquema, comentarios: [], cntComentarios: 0};
      this.getCntCommentsSubPath(this.todoEsquema[code]['path']).then(data => node.cntComentarios = data);

      if (this.todoEsquema[code]['properties']) {
        node.children = this.getChildren(this.todoEsquema[code]['properties']);
        children.push(node);
      } else if (this.todoEsquema[code]['allOf']) {
        node.children = this.getChildren(this.todoEsquema[code]['allOf']);
        children.push(node);
      } else {
        tableItems.push(node);
      }
    }
    if (tableItems.length > 0) children.push({ tableItems: tableItems });
    return children;
  }

  getOnlyChild(){
    let child: EsquemaNode[] = [];
    let tableItems: any[] = [];
    let node: EsquemaNode = {name: this.link, literal: this.literal, literaleu: this.literaleu, esquema: this.esquema, comentarios: []};
    this.getCommentsByPath(this.todoEsquema[this.link]['path']).then(data => node.comentarios = data);
    this.getCntCommentsSubPath(this.todoEsquema[this.link]['path']).then(data => node.cntComentarios = data);
    tableItems.push(node);
    child.push({tableItems: tableItems});
    
    return child;
  }

  loadLiteralParent(): void {
    let path: string = this.esquema['path'];
    let pathArray: string[] = path.split('/');
    let code = pathArray[pathArray.length-2];
    this.literal = this.literaleses[code] ? this.literaleses[code] : this.literaleses[code.toLowerCase()];
    this.literaleu = this.literaleseu[code] ? this.literaleseu[code] : this.literaleseu[code.toLowerCase()];
  }

  async getCommentsByPath(path: string): Promise<Comment[]> {
    let comments: Comment[] = [];
    await this.apiService.getCommentsByPathAsync(path).toPromise().then(result => {
      switch (result.status) {
        case Status.Success:
          comments = result.data;
          break;
        case Status.Error:
          console.log(result.message);
          break;
      }
    }).catch(err => {
      console.log(err);
    });
    return comments;
  }

  async getCntCommentsSubPath(path: string): Promise<number> {
    let cnt: number;
    await this.apiService.getCntCommentsSubPathAsync(path).toPromise().then(result => {
      switch (result.status) {
        case Status.Success:
          cnt = result.data;
          break;
        case Status.Error:
          console.log(result.message);
          break;
      }
    }).catch(err => {
      console.log(err);
    });
    return cnt;
  }

  openDialogComments(node: EsquemaNode) {
    this.spinnerService.show();
    this.getCommentsByPath(node.esquema['path']).then(data => {
      node.comentarios = data
      let dialogRef = this.dialog.open(DialogCommentsComponent, {
        data: {
          commentList: node.comentarios,
          path: node.esquema['path']
        }
      });
      this.spinnerService.hide();
      dialogRef.afterClosed().subscribe(result => {
        node.cntComentarios = this.countActiveComments(node.comentarios);
        this.updateCntComments(this.dataSource.data);
      });
    });
  }

  openDialogEnumList(codigo: string, enumList: any[]) {
    this.dialog.open(DialogEnumComponent, {
      data: {
        codigo: codigo,
        enumList: enumList,
        literaleses: this.literaleses,
        literaleseu: this.literaleseu
      }
    });
  }

  countActiveComments(commentList: Comment[]): number {
    let cnt: number = 0;
    if (!commentList || commentList.length == 0) return 0;
    commentList.forEach(comment => {
      cnt += (comment.isActive ? 1 : 0);
    });
    return cnt;
  }

  updateCntComments(nodes: EsquemaNode[]): void {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateCntComments(node.children);
      }
      node.cntComentarios = this.countChildrenActiveComments(node);
    });
  }

  countChildrenActiveComments(node: EsquemaNode): number {
    let cnt = 0;
    if (node.children && node.children.length > 0) {
      node.children.forEach(nodeChild => {
      cnt += this.countChildrenActiveComments(nodeChild);
      });
    } else {
      node.tableItems.forEach(item => {
        let cntComentarios: number = item['cntComentarios'];
        cnt += cntComentarios ? cntComentarios : 0;
      });
    }
    return cnt;
  }

}
