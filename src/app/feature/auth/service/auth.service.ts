import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { TABLES } from 'src/app/core/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  public firestore = inject(AngularFirestore);

  signUp(value: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(value.email, value.password).then((result) => {
        this.setUserData(result.user, value)
      })
  }

  signIn(value: any) {
    return this.afAuth
      .signInWithEmailAndPassword(value.email, value.password)
  }

  setUserData(user: any, defaultUser: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const userData: any = {
      id: user.uid,
      email: user.email,
      name: defaultUser.name,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  getUserByUid(uid: string): Observable<any> {
    return this.firestore.collection(TABLES.USERS).doc(uid).valueChanges();
  }
}
