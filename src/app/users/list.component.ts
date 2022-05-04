import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '../_services';
import { User } from '../_models';
import {MatSortModule} from '@angular/material/sort';
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users!: User[];
    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', ''];
    dataSource = this.users;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        if (!user) return;
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }


    

    
}