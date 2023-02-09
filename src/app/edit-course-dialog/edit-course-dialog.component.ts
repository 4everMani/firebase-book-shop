import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Storage } from '@angular/fire/storage';
import { catchError, Observable } from 'rxjs';
import { CoursesService } from '../services/courses.service';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.scss']
})
export class EditCourseDialogComponent {

    public editCourseForm!: FormGroup;

    private course!: Course;
    constructor(private dialogRef: MatDialogRef<EditCourseDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesService: CoursesService) {
            this.course = course;
        this.editCourseForm = this.fb.group({
            description: [course.description, Validators.required],
            longDescription: [course.longDescription, Validators.required],
            promo: [course.promo],

        })
    }

    public close(): void {
        this.dialogRef.close();
    }

    public save(): void{
        const changes = this.editCourseForm.value
        this.coursesService.updateCourse(this.course.id,changes)
        .pipe(
            catchError(err => {
                alert(err);
                throw err;
            })
        )
        .subscribe(res => {
            this.dialogRef.close(changes);
        })
        
    }

}






