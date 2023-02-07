import { Component, OnInit } from '@angular/core';


// import 'firebase/firestore';

// import { Firestore, collection, addDoc, doc, DocumentData, CollectionReference, docData, getDoc } from '@angular/fire/firestore';
import { from, of } from 'rxjs';
import { COURSES, findLessonsForCourse } from './db-data';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = courseRef.collection('lessons');
            const courseOfTypeAny = course as any;
            const courseLessons = findLessonsForCourse(courseOfTypeAny['id']);
            console.log(`Uploading course ${courseOfTypeAny['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = { ...data };
        delete newData.id;
        return newData;
    }

    public onReadDoc() {
        this.db.doc(`/courses/0xZ3AoCccyDtjdgyE5vk`).get().subscribe(res =>{
            console.log(res.data());
        })
    }

    public onReadCollection() {
        this.db.collection('courses', 
        ref => ref.where("seqNo", ">=", 5)).get().subscribe((snaps) =>{
            snaps.forEach(snap => {
                console.log(snap.data(), snap.id)
            })
        })
    }

}
















