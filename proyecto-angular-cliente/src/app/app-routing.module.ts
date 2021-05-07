import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { ErrorComponent } from './error/error.component';
import { componentFactoryName } from '@angular/compiler';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { DatabaseComponent } from './error/database/database.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'content/:link',
    component: ContentComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'error',
    component: ErrorComponent,
    children: [
     { 
      path: '404',
      component: NotFoundComponent
    },
    { 
      path: 'database',
      component: DatabaseComponent
    },
    ]
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }