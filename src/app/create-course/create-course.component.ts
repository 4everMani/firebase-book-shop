import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { Course } from '../model/course';
import { catchError, concatMap, last, map, take, tap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@angular/fire/storage';
import { CoursesService } from '../services/courses.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

// import {firebase} from 'firebase/compat/app';
// import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  private courseId!: string;

  public createCourseForm !: FormGroup;
  constructor(private fb: FormBuilder,
    private courseService: CoursesService,
    private db: AngularFirestore,
    private router: Router) {
    this.createCourseForm = fb.group({
      description: ['', Validators.required],
      longDescription: ['', Validators.required],
      category: ['BEGINNER', Validators.required],
      url: ['', ],
      promo: [false],
      promoStartAt: [null]
    })

  }

  ngOnInit() {
    this.courseId = this.db.createId();
  }

  public onCreateCourse(): void {
    const val = this.createCourseForm.value;

    const newCourse: Partial<Course> = {
      description: val.description,
      url: val.url,
      longDescription: val.longDescription,
      promo: val.promo,
      categories: [val.category]
    };
    newCourse.promoStartAt = Timestamp.fromDate(this.createCourseForm.get('promoStartAt')?.value);
    console.log(newCourse);
    this.courseService.createCourse(newCourse, this.courseId)
      .pipe(
        tap(course => {
          console.log(course);
          this.router.navigateByUrl('/courses');
        }),
        catchError(err => {
          console.log(err);
          alert(`Course couldn't created`);
          return throwError(err);
        })
      ).subscribe();
  }

}
