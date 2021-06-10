import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
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
import { Globals } from '../shared/globals';
import { NodosOrigenDF } from '../models/nodos-origen-df.model';

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

  breadcrumbs: string[];

  cellNameToScroll: undefined | string;
  link: string;
  path: string;
  literaleses: {} = {};
  literaleseu: {} = {};
  todoEsquema: {} = {};
  esquema: {} = {};
  isArrayType = false;
  comentarios: Comment[] = [];
  cntComentarios: number = 0;
  cntComentariosSubpath: number = 0;
  literal: string;
  literaleu: string;
  literalMaxLength: number = 50;
  defaultTitle = 'Configuración NPR';

  ALL_TABLE_COLS = ['type', 'format', 'minimum', 'maximum', 'minLength', 'maxLength', 'enum', 'expandible', 'readOnly', 'multipleOf', 'required', 'path'];
  TABLE_COLS = ['type', 'format', 'minimum', 'maximum', 'minLength', 'maxLength', 'enum', 'expandible', 'readOnly', 'multipleOf', 'required', 'path'];
  COLS_HIDE = ['expandible', 'multipleOf', 'path'];
  treeControl = new NestedTreeControl<EsquemaNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<EsquemaNode>();

  private scrollTarget: ElementRef;

  nodosOrigenesDF: NodosOrigenDF[] = [];
  origenes: string[] = [];
  //TESTTTT
  origenesNodoDF: {[key: string]: string[]} = {};


  @ViewChild('scrollTarget') set content(content: ElementRef) {
     if(content) { // initially setter gets called with undefined
          this.scrollTarget = content;
          this.scrollTarget.nativeElement.scrollIntoView({ behavior: "smooth", block: "center" });
     }
  }

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private titleService: TitleService,
    private authService: AuthenticationService,
    private spinnerService: SpinnerService
  ) {
    this.todoEsquema = this.globals.esquema;
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
    this.nodosOrigenesDF = this.globals.nodosOrigenesDF;
  }
  hasChild = (_: number, node: EsquemaNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    //TESTT
    this.nodosOrigenesDF.forEach(nodosOrigen => {
      nodosOrigen.nodos.forEach(nodo => {
        if(!this.origenesNodoDF[nodo]) this.origenesNodoDF[nodo] = [];
        this.origenesNodoDF[nodo].push(nodosOrigen.origen);
      })
    });
    console.log(this.origenesNodoDF)

    this.checkUser();
    this.subscribeParams();
  }

  checkUser(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
      this.updateUserRolContent();
    }, error => {
      console.log(error);
    });
  }

  updateUserRolContent() {
    if (this.user.rol != Rol.Desarrollador) {
      this.COLS_HIDE.forEach(col => {
        var index = this.TABLE_COLS.indexOf(col);
        if (index != -1) this.TABLE_COLS.splice(index, 1);
      });
    } else {
      this.TABLE_COLS = Object.assign([], this.ALL_TABLE_COLS);
    }
    if (this.titleService.currentTitleValue != this.defaultTitle) {
      this.titleService.changeTitle((this.user.rol == Rol.Desarrollador ? this.link + ' - ' : '') + this.literal + ' - ' + this.literaleu);
    }
  }

  subscribeParams(): void {
    this.route.params.subscribe(params => {
      this.cellNameToScroll = undefined;
      this.link = params['link'];
      this.esquema = this.todoEsquema[this.link];
      if (this.esquema == null) {
        this.router.navigate(['/error/404']);
        return;
      }
      this.path = this.esquema['path'];
      if (!this.esquema['allOf'] && !this.esquema['properties']) {
        this.cellNameToScroll = this.link;
        let parentCode = this.path.split('/')[this.path.split('/').length -2];
        this.link = parentCode;
        this.esquema = this.todoEsquema[parentCode];
        this.path = this.esquema['path'];
      }
      this.isArrayType = this.esquema['type'] == 'array';
      this.getCntCommentsSubPath(this.link).then(data => this.cntComentariosSubpath = data);
      this.literal = (this.literaleses[this.link] ? this.literaleses[this.link] : this.literaleses[this.link.toLowerCase()]);
      this.literaleu = (this.literaleseu[this.link] ? this.literaleseu[this.link] : this.literaleseu[this.link.toLowerCase()]);
      if (this.user && this.user.rol == Rol.Desarrollador) {
        this.titleService.changeTitle(this.link + ' - ' + this.literal + ' - ' + this.literaleu);
      } else {
        this.titleService.changeTitle(this.literal + ' - ' + this.literaleu);
      }

      this.origenes = this.origenesByNodo(this.link);
      this.loadComentarios(this.esquema['path']);
      this.loadBreadcrumbs();
      this.fillTree();
    });
  }

  loadComentarios(path: string): void {
    this.getCommentsByPath(path).then(data => {
      this.comentarios = data;
      this.cntComentarios = this.countActiveComments(this.comentarios);
    });
  }

  loadBreadcrumbs(): void {
    let path: string = this.esquema['path'];
    if (!path) return;
    let pathArray = path.split('/');
    pathArray.shift();
    this.breadcrumbs = pathArray;
  }

  fillTree() {
    let dataInsert: EsquemaNode[] = [];
    if (this.esquema['properties']) {
      dataInsert = this.getChildren(this.esquema['properties']);
    } else if (this.esquema['allOf']) {
      dataInsert = this.getChildren(this.esquema['allOf']);
    }
    this.dataSource.data = dataInsert;
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

      let node: EsquemaNode = { name: code, literal: literal, literaleu: literaleu, esquema: esquema, comentarios: [], cntComentariosSubpath: 0 };
      this.getCntCommentsSubPath(code).then(data => node.cntComentariosSubpath = data);
      this.getCommentsByPath(this.todoEsquema[code]['path']).then(data => {
        node.comentarios = data;
        node.cntComentariosActivos = this.countActiveComments(node.comentarios);
      });
      this.getPathHasUnreadLogs(code).then(data => node.hasUnreadLogs = data);

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
  async getPathHasUnreadLogs(path: string): Promise<boolean> {
    let pathHasUnreadLogs = false;
    await this.apiService.getPathHasUnreadLogsForUserAsync(this.user.userId, path).toPromise().then(result => {
      switch (result.status) {
        case Status.Success:
          pathHasUnreadLogs = result.data;
          break;
        case Status.Error:
          console.log(result.message);
          break;
      }
    }).catch(err => {
      console.log(err);
    });
    return pathHasUnreadLogs;
  }

  openDialogCommentsByPath(path: string) {
    this.spinnerService.show();
    this.getCommentsByPath(path).then(data => {
      this.comentarios = data
      let dialogRef = this.dialog.open(DialogCommentsComponent, {
        data: {
          commentList: this.comentarios,
          path: path
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cntComentarios = this.countActiveComments(this.comentarios);
      });
      this.spinnerService.hide();
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

  openDialogComments(node: EsquemaNode) {
    this.spinnerService.show();
    this.getCommentsByPath(node.esquema['path']).then(data => {
      node.comentarios = data;
      let dialogRef = this.dialog.open(DialogCommentsComponent, {
        data: {
          commentList: node.comentarios,
          path: node.esquema['path']
        },
        width: '600px'
      });
      this.spinnerService.hide();
      dialogRef.afterClosed().subscribe(result => {
        node.cntComentariosSubpath = this.countActiveComments(node.comentarios);
        node.cntComentariosActivos = node.cntComentariosSubpath;
        this.updateCntComments(this.dataSource.data);
        this.updateNotifications(this.dataSource.data);
      });
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

  openDialogEnumList(codigo: string, enumList: any[]) {
    this.dialog.open(DialogEnumComponent, {
      data: {
        codigo: codigo,
        enumList: enumList
      },
      width: '900px'
    });
  }

  countActiveComments(commentList: Comment[]): number {
    if (!commentList || commentList.length == 0) return 0;
    let cnt: number = commentList.filter(c => c.isActive).length;
    return cnt;
  }

  updateCntComments(nodes: EsquemaNode[]): void {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateCntComments(node.children);
      }
      node.cntComentariosSubpath = this.countChildrenActiveComments(node);
    });
  }

  countChildrenActiveComments(node: EsquemaNode): number {
    let cnt = 0;
    let cntComentariosActivos: number = node.cntComentariosActivos;
    cnt += cntComentariosActivos ? cntComentariosActivos : 0;
    if (node.children && node.children.length > 0) {
      node.children.forEach(nodeChild => {
        cnt += this.countChildrenActiveComments(nodeChild);
      });
    } else {
      node.tableItems.forEach(item => {
        let cntComentarios: number = item['cntComentariosSubpath'];
        cnt += cntComentarios ? cntComentarios : 0;
      });
    }
    return cnt;
  }

  updateNotifications(nodes: EsquemaNode[]): void {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateNotifications(node.children);
      }
      this.getPathHasUnreadLogs(node.name).then(data => node.hasUnreadLogs = data);
      if (node.tableItems && node.tableItems.length > 0) {
        node.tableItems.forEach(item => {
        this.getPathHasUnreadLogs(item['name']).then(data => item['hasUnreadLogs'] = data);
        });
      }
    });
  }

  origenesByNodo(nodo: string): string[] {
    let origenes: string[] = [];
    this.nodosOrigenesDF.forEach(nodosOrigenDF => {
      if (nodosOrigenDF.nodos.indexOf(nodo) !== -1) origenes.push(nodosOrigenDF.origen);
    });
    return origenes;
  }

}