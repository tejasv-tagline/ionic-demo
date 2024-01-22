import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileDetailsPage } from './components/profile-details/profile-details.page';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage {

  private userService = inject(UserService);
  private postService = inject(PostService);
  private router = inject(Router);



  @Input() private userId!: string;
  public user: any;
  public posts: any;

  constructor() {}

  ngOnInit() {
    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe((res) => {
        this.user = res.payload.data();
      });

      this.postService.getPostByUserId(this.userId).subscribe((res) => {
        this.posts = res.docs.map((e: any) => {
          return { ...e.data(), id: e.id };
        });
        console.log('this.posts :>> ', this.posts);
      });
    }
  }

  // public component = ProfileDetailsPage;
  public gotoPost(postId: string) {
    this.router.navigate(['/post', postId]);
  }
  
}
