import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered lessons
const lessonsKey = 'ProyFinalCoderHouseLessons';
const lessonsJSON = localStorage.getItem(lessonsKey);
let lessons: any[] = lessonsJSON ? JSON.parse(lessonsJSON) : [{
    id: 1,
    clase: 'Formularios reactivos',
    descripcion: 'Aprende a desarrollador formularios dinámicos con Angular',
    curso: 'Angular'
}];

@Injectable()
export class FakeBackendInterceptor2 implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/lessons') && method === 'GET':
                    return getLessons();
                case url.match(/\/lessons\/\d+$/) && method === 'GET':
                    return getLessonById();
                case url.endsWith('/lessons') && method === 'POST':
                    return createLesson();
                case url.match(/\/lessons\/\d+$/) && method === 'PUT':
                    return updateLesson();
                case url.match(/\/lessons\/\d+$/) && method === 'DELETE':
                    return deleteLesson();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function getLessons() {
            return ok(lessons.map(x => basicDetails(x)));
        }

        function getLessonById() {
            const lesson = lessons.find(x => x.id === idFromUrl());
            return ok(basicDetails(lesson));
        }

        function createLesson() {
            const lesson = body;

            if (lessons.find(x => x.clase === lesson.clase)) {
                return error(`Lesson with the curso ${lesson.clase} already exists`);
            }

            // assign lesson id and a few other properties then save
            lesson.id = newLessonId();
            lessons.push(lesson);
            localStorage.setItem(lessonsKey, JSON.stringify(lessons));

            return ok();
        }

        function updateLesson() {
            let params = body;
            let lesson = lessons.find(x => x.id === idFromUrl());

            if (params.clase !== lesson.clase && lessons.find(x => x.clase === params.clase)) {
                return error(`Lesson with the curso ${params.curso} already exists`);
            }

            // update and save lesson
            Object.assign(lesson, params);
            localStorage.setItem(lessonsKey, JSON.stringify(lessons));

            return ok();
        }

        function deleteLesson() {
            lessons = lessons.filter(x => x.id !== idFromUrl());
            localStorage.setItem(lessonsKey, JSON.stringify(lessons));
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

        function basicDetails(lesson: any) {
            const { id, clase, descripcion, curso } = lesson;
            return { id, clase, descripcion, curso };
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newLessonId() {
            return lessons.length ? Math.max(...lessons.map(x => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendProvider2 = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor2,
    multi: true
};