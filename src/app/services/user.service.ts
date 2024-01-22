import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TABLES } from '../core/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(AngularFirestore);
  constructor() {}

  getUserProfile(userId: string) {
    return this.firestore
      .collection(TABLES.USERS)
      .doc(userId)
      .snapshotChanges();
  }

}
