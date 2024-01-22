import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TABLES } from '../core/constants';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public firestore = inject(AngularFirestore);

  constructor() { }

  public addPost(postDetails:any){
    return this.firestore.collection(TABLES.POSTS).add(postDetails);
  }

  public getPosts(){
    return this.firestore.collection(TABLES.POSTS).snapshotChanges();
  }

  public deletePost(postId:string){
    return this.firestore.collection(TABLES.POSTS).doc(postId).delete();
  }

  public getPostByUserId(userId:string){
    return this.firestore.collection(TABLES.POSTS,(ref)=> ref.where('userId','==',userId)).get();
  }

}
