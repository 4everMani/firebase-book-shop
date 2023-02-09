import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {AngularFireAuthGuard, canActivate, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { CourseResolver } from './services/course.resolver';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])

const isAdmin = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '' ,
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
    
  },
  {
    path: 'create-course',
    component: CreateCourseComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: isAdmin
    }

  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: isAdmin
    }

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'courses/:courseUrl',
    component: CourseComponent,
    resolve: {
      course: CourseResolver
    },
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
