import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class ProfileDetailsPage implements OnInit {

  private userService = inject(UserService);
  private postService = inject(PostService);
  private activeRouter = inject(ActivatedRoute);

  private userId!: string;
  public user: any;
  public posts: any;

  constructor() {
    this.activeRouter.params.subscribe((params:any)=>{
      this.userId = params.userId;
    });
  }

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

}
