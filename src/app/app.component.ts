import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {from, Observable} from 'rxjs';
import {concatMap, filter, map} from 'rxjs/operators';
import {Firestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }

}
