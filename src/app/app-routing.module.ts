import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const lessonsModule = () => import('./lessons/lessons.module').then(x => x.LessonsModule);
const coursesModule = () => import('./courses/courses.module').then(x => x.CoursesModule);

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'users', loadChildren: usersModule },
    { path: 'lessons', loadChildren: lessonsModule },
    { path: 'courses', loadChildren: coursesModule },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }