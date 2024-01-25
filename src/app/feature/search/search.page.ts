import { LoaderService } from './../../shared/services/loader.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SearchPage implements OnInit {

  private postService = inject(PostService);
  private loaderService = inject(LoaderService);
  private router = inject(Router);


  public posts: any = [];
  public tempPosts:any = [];
  constructor() { }

  ngOnInit() {
    console.log('Search ');
    this.getAllPosts();
  }

  handleInput(event:any) {
    const query = event.target.value.toLowerCase();
    // this.postService.getPostByUserName(query).subscribe((post:any)=>{
    //   const posts = post.docs.map((e: any) => {
    //     return { ...e.data(), id: e.id };
    //   });
    //   console.log('this.posts :>> ', posts);
    // })
    this.posts = this.tempPosts.filter((post:any) => {
      return post.userName.toLowerCase().includes(query)
    });
  }

  private getAllPosts(): void {
    this.loaderService.showLoading('Posts Loading!');
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.map((e) => {
          return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
        });
        this.tempPosts = this.posts;
        this.loaderService.hideLoading();
      },
      error:(err:any)=>{
        this.loaderService.hideLoading();
      }
    });
  }

  public gotoPost(postId: string) {
    this.router.navigate(['/post', postId],{queryParams:{backPage:`/search`}});
  }

}
