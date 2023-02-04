import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Firestore} from '@angular/fire/firestore';
import {Course} from '../model/course';
import {catchError, concatMap, last, map, take, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Storage} from '@angular/fire/storage';
// import {firebase} from 'firebase/compat/app';
// import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }

}
