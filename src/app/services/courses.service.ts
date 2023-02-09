import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { OrderByDirection } from "@angular/fire/firestore";
import { concatMap, from, map, Observable } from "rxjs";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { convertSnaps } from "./db.utils";

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(private db: AngularFirestore) { }

    public loadCoursesByCategory(category: string): Observable<Course[]>{
       return this.db.collection<Course>('courses',
        ref => ref.where("categories","array-contains",category).orderBy("seqNo")).get()
        .pipe(
            map(snaps => {
                return convertSnaps<Course>(snaps)
                })
            )
    }

    public createCourse(newCourse: Partial<Course>, id?: string): Observable<any>{
         return this.db.collection<Course>('courses', ref => ref.orderBy('seqNo','desc')).get()
        .pipe(
            concatMap(result => {
                const courses = convertSnaps<Course>(result);
                const lastCourseSeqNo = courses[0]?.seqNo ?? 0;
                const course = { ...newCourse, seqNo: lastCourseSeqNo + 1};
                let save$: Observable<any>;
                if (id){
                    save$ = from(this.db.doc(`courses/${id}`).set(course));
                }
                else{
                    save$ = from(this.db.collection('courses').add(course));
                }
                return save$.pipe(
                    map((res: Course) =>{
                        return {id: id ?? res.id, ...course}
                    })
                );
            })
        )
    }

    public updateCourse(courseId: string, changes: Partial<Course>): Observable<any>{
        return from(this.db.doc(`courses/${courseId}`).update(changes))
    }

    public deleteCourse(courseId: string): Observable<void>{
        return from(this.db.doc(`courses/${courseId}`).delete());
    }

    public deleteCourseAndLessons(courseId: string): Observable<void>{
        return this.db.collection(`courses/${courseId}/lessons`).get()
        .pipe(
            concatMap(results => {
                const lessons = convertSnaps<Course>(results);
                const batch = this.db.firestore.batch();
                const courseRef = this.db.doc(`courses/${courseId}`).ref;
                batch.delete(courseRef);
                lessons.forEach(lesson => {
                    const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;
                    batch.delete(lessonRef);
                });
                return from(batch.commit());
            })
        )
    }

    public findCourseByUrl(url: string): Observable<Course>{
        return this.db.collection('courses', ref => ref.where('url','==',url)).get()
        .pipe(
            map(results => {
                const courses = convertSnaps<Course>(results);
                return courses[0];
            })
        )
    }

    public findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber= 0, pageSize = 3): Observable<Lesson[]>{
        return this.db.collection(`courses/${courseId}/lessons`,
        ref => ref.orderBy('seqNo', sortOrder)
        .limit(pageSize)
        .startAt(pageNumber * pageSize))
        .get()
        .pipe(map(results => {
            return convertSnaps<Lesson>(results);
        }))
    }


}