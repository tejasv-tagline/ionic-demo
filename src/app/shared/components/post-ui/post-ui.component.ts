import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { PostService } from 'src/app/services/post.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  standalone: true,
  styleUrls: ['./post-ui.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PostUiComponent {
  private localstorageService = inject(LocalstorageService);
  private postService = inject(PostService);
  private toastController = inject(ToastController);

  @Input() post: any = {};

  public user: any = this.localstorageService.getItem('userDetails');

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'].currentValue) {
      this.postService.getLikes(this.post.id).subscribe((res) => {
        this.post.likes = res.map((e) => {
          const data = e.payload.doc.data();
          return data;
        });
        const liked = this.post.likes.find(
          (like: any) => like.userId === this.user.id
        );
        this.post.isLiked = liked?.userId === this.user.id;
      });
    }
  }
  public onLike(i: number) {
    this.post.isLiked = !this.post.isLiked;
    const userDetails = this.localstorageService.getItem('userDetails');

    const likedDetails = {
      userId: userDetails.id,
      userName: userDetails.name,
    };
    if (!this.post.isLiked) {
      this.postService
        .removeLike(this.post.id, this.user.id)
        .then(() => {})
        .catch(async (e: any) => {
          const toast = await this.toastController.create({
            message: 'Somthing went wrong!',
            duration: 1500,
            position: 'top',
          });
          await toast.present();
        });
    } else {
      this.postService
        .addLike(this.post.id, likedDetails)
        .then(() => {})
        .catch(async (e: any) => {
          const toast = await this.toastController.create({
            message: 'Somthing went wrong!',
            duration: 1500,
            position: 'top',
          });
          await toast.present();
        });
    }
  }
}
