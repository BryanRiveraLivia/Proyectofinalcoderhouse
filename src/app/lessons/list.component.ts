import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { LessonService } from '../_services';
import { Lesson } from '../_models';
import {MatSortModule} from '@angular/material/sort';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    lessons!: Lesson[];
    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', ''];
    dataSource = this.lessons;

    constructor(private lessonService: LessonService) {}

    ngOnInit() {
        this.lessonService.getAll()
            .pipe(first())
            .subscribe(lessons => this.lessons = lessons);
    }

    deleteUser(id: string) {
        const lesson = this.lessons.find(x => x.id === id);
        if (!lesson) return;
        lesson.isDeleting = true;
        this.lessonService.delete(id)
            .pipe(first())
            .subscribe(() => this.lessons = this.lessons.filter(x => x.id !== id));
    }


    

    
}