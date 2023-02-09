import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  course?: Course;

  loading = false;

  lessons?: Lesson[];

  lastPageLoaded = 0;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(private route: ActivatedRoute,
              private coursesServie: CoursesService) {

  }

  ngOnInit() {
    this.course = this.route.snapshot.data['course'];
    this.loading = true;
    this.coursesServie.findLessons(this.course!.id)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe(
      res => {
        this.lessons = res;
      }
    )
  }

  public loadMore(): void{
    this.lastPageLoaded++;
    this.coursesServie.findLessons(this.course!.id, 'asc', this.lastPageLoaded)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe(
      res => {
        this.lessons = this.lessons?.concat(res);
      }
    )

  }

}
