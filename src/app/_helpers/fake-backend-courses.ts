import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered courses
const coursesKey = 'ProyFinalCoderHouseCourses';
const coursesJSON = localStorage.getItem(coursesKey);
let courses: any[] = coursesJSON ? JSON.parse(coursesJSON) : [{
    id: 1,
    curso: 'Angular',
    descripcion: 'Aprende a desarrollador formularios dinámicos con Angular',
    tutor: 'Neill Rivera'
}];

@Injectable()
export class FakeBackendInterceptor3 implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/courses') && method === 'GET':
                    return getCourses();
                case url.match(/\/courses\/\d+$/) && method === 'GET':
                    return getCourseById();
                case url.endsWith('/courses') && method === 'POST':
                    return createCourse();
                case url.match(/\/courses\/\d+$/) && method === 'PUT':
                    return updateCourse();
                case url.match(/\/courses\/\d+$/) && method === 'DELETE':
                    return deleteCourse();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function getCourses() {
            return ok(courses.map(x => basicDetails(x)));
        }

        function getCourseById() {
            const course = courses.find(x => x.id === idFromUrl());
            return ok(basicDetails(course));
        }

        function createCourse() {
            const course = body;

            if (courses.find(x => x.curso === course.curso)) {
                return error(`Course with the curso ${course.curso} already exists`);
            }

            // assign course id and a few other properties then save
            course.id = newCourseId();
            courses.push(course);
            localStorage.setItem(coursesKey, JSON.stringify(courses));

            return ok();
        }

        function updateCourse() {
            let params = body;
            let course = courses.find(x => x.id === idFromUrl());

            if (params.curso !== course.curso && courses.find(x => x.curso === params.curso)) {
                return error(`Course with the curso ${params.curso} already exists`);
            }

            // update and save course
            Object.assign(course, params);
            localStorage.setItem(coursesKey, JSON.stringify(courses));

            return ok();
        }

        function deleteCourse() {
            courses = courses.filter(x => x.id !== idFromUrl());
            localStorage.setItem(coursesKey, JSON.stringify(courses));
            return ok();
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: any) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function basicDetails(course: any) {
            const { id, curso, descripcion, tutor } = course;
            return { id, curso, descripcion, tutor };
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newCourseId() {
            return courses.length ? Math.max(...courses.map(x => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendProvider3 = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor3,
    multi: true
};