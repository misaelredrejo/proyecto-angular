import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from '../shared/api.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogCommentsComponent } from './dialog-comments/dialog-comments.component';

export interface DialogData {
  comments: any[];
}

interface EsquemaNode {
  name: string;
  literal: string;
  children?: EsquemaNode[];
  esquema?: any;
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
            } else {
              dataInsert.push({ name: this.link, esquema: this.esquema, literal: this.literal});
            }
            

            this.dataSource.data = dataInsert;
          });

        },
        err => {
          console.log(err);
        }
      );
  }

  getChildren(properties: any) {
    let children: EsquemaNode[] = [];
    for (let key in properties) {
      let literal = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
      if (this.todoEsquema[key]['properties']) {
        children.push({ name: key, children: this.getChildren(this.todoEsquema[key]['properties']), literal: literal });
      } else {
        children.push({ name: key, esquema: this.todoEsquema[key], literal: literal });
      }
    }

    return children;
  }

  openDialog() {
    this.dialog.open(DialogCommentsComponent, {
      data: {
        comments: [
          'Esto es una prueba de comentario',
          'Otro comentariocomentariocomentariocomentariocomentario'
        ]
      }
    });
  }

}
