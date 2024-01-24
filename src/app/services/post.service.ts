import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TABLES } from '../core/constants';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public firestore = inject(AngularFirestore);

  constructor() {}

  public addPost(postDetails: any) {
    return this.firestore.collection(TABLES.POSTS).add(postDetails);
  }

  public getPosts() {
    return this.firestore.collection(TABLES.POSTS).snapshotChanges();
  }

  public getLikes(postId: string) {
    return this.firestore
      .collection(TABLES.POSTS)
      .doc(postId)
      .collection(TABLES.LIKES)
      .snapshotChanges();
  }

  public getPost(postId: string) {
    return this.firestore
      .collection(TABLES.POSTS)
      .doc(postId)
      .snapshotChanges();
  }

  public deletePost(postId: string) {
    return this.firestore.collection(TABLES.POSTS).doc(postId).delete();
  }

  public getPostByUserId(userId: string) {
    return this.firestore
      .collection(TABLES.POSTS, (ref) =>
        ref.where('userId', '==', userId).orderBy('postTime', 'desc')
      )
      .get();
  }

  // public getPostById(postId: string) {
  //   return this.firestore
  //     .collection(TABLES.POSTS)
  //     .doc(postId)
  //     .snapshotChanges();
  // }

  // public updatePost(postId: string, updateValue: any) {
  //   return this.firestore
  //     .collection(TABLES.POSTS)
  //     .doc(postId)
  //     .update(updateValue);
  // }

  public addLike(postId: string, data: any) {
    return this.firestore
      .collection(TABLES.POSTS)
      .doc(postId)
      .collection(TABLES.LIKES)
      .doc(data.userId)
      .set(data);
  }

  public removeLike(postId: string, userId: string) {
    return this.firestore
      .collection(TABLES.POSTS)
      .doc(postId)
      .collection(TABLES.LIKES)
      .doc(userId)
      .delete();
  }
}
