import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { UserRoles } from "../model/user-roles";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public isLoggedIn$!: Observable<boolean>;

    public isLoggedOut$!: Observable<boolean>;

    public pictureUrl$!: Observable<string | null>;

    public roles$!: Observable<UserRoles>;

    constructor(private afAuth: AngularFireAuth, private route: Router) {
        this.isLoggedIn$ = afAuth.authState.pipe(map(user => !!user));
        this.roles$ = afAuth.idTokenResult.pipe(map(token => {
            return <any>token?.claims ?? {admin: false}
        }))
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
        this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user ? user.photoURL : null));
    
    }

    public logout() {
        this.afAuth.signOut();
        this.route.navigateByUrl('/login');
    }
}