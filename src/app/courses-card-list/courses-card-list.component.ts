import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditCourseDialogComponent} from "../edit-course-dialog/edit-course-dialog.component";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.scss']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses!: Course[];

    @Output()
    courseEdited = new EventEmitter();

    @Output()
    courseDeleted = new EventEmitter<Course>();

    constructor(
      private dialog: MatDialog,
      private router: Router,
      private coursesService: CoursesService,
      public user: UserService) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = "420px";

        dialogConfig.data = course;

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                if (val) {
                    // this.courseEdited.emit();
                }
            });

    }

    public delete(course: Course){
        this.coursesService.deleteCourseAndLessons(course.id)
        .pipe(
            catchError(err => {
                console.log(err);
                alert(err)
                return throwError(err)
            })
        )
        .subscribe(() =>{
            this.courseDeleted.emit();
        })
    }

}









