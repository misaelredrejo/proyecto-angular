import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {
  NgMaterialMultilevelMenuModule,
  MultilevelMenuService
} from "ng-material-multilevel-menu";
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    NgMaterialMultilevelMenuModule,
    MatTooltipModule,
    MatMenuModule,
    MatExpansionModule,
    MatTreeModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [MultilevelMenuService,],
})
export class MaterialModule { }
