import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Course } from '../_models';

const baseUrl = `${environment.apiUrl}/courses`;

@Injectable({ providedIn: 'root' })
export class CourseService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Course[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Course>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}