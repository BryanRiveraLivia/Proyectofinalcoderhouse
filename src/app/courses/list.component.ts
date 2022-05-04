import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CourseService } from '../_services';
import { Course } from '../_models';
import {MatSortModule} from '@angular/material/sort';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    courses!: Course[];
    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', ''];
    dataSource = this.courses;

    constructor(private courseService: CourseService) {}

    ngOnInit() {
        this.courseService.getAll()
            .pipe(first())
            .subscribe(courses => this.courses = courses);
    }

    deleteUser(id: string) {
        const course = this.courses.find(x => x.id === id);
        if (!course) return;
        course.isDeleting = true;
        this.courseService.delete(id)
            .pipe(first())
            .subscribe(() => this.courses = this.courses.filter(x => x.id !== id));
    }


    

    
}