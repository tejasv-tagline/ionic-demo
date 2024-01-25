import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage {

  private userService = inject(UserService);
  private localstorageService = inject(LocalstorageService);
  private postService = inject(PostService);
  private router = inject(Router);



  // @Input() private userId!: string;
  private userId:any;
  public user: any;
  public posts: any;

  constructor() {}

  ngOnInit() {
    this.userId = this.localstorageService.getItem('userDetails');
    if (this.userId) {
      this.userService.getUserProfile(this.userId.id).subscribe((res) => {
        this.user = res.payload.data();
      });

      this.postService.getPostByUserId(this.userId.id).subscribe((res) => {
        this.posts = res.docs.map((e: any) => {
          return { ...e.data(), id: e.id };
        });
      });
    }
  }

  // public component = ProfileDetailsPage;
  public gotoPost(postId: string) {
    this.router.navigate(['/post', postId],{queryParams:{backPage:`/profile`}});
  }
  
}
