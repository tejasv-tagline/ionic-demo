import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { PostService } from 'src/app/services/post.service';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  standalone: true,
  styleUrls: ['./post-ui.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PostUiComponent {
  private localstorageService = inject(LocalstorageService);
  private postService = inject(PostService);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private fireStorage = inject(AngularFireStorage);


  @Input() post: any = {};
  public actionSheetButtons: any = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Share',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  public defaultActionSheetButtons = [
    {
      text: 'Share',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  public isModalOpen: boolean = false;
  public comment!: string;
  public comments: any = [];

  public user: any = this.localstorageService.getItem('userDetails');

  constructor() { }

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
        .then(() => { })
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
        .then(() => { })
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

  logResult(ev: any, post: any) {
    const eventVal = ev.detail.data && ev.detail.data.action;
    if (eventVal === 'share') {
      console.log('navigator :>> ', navigator);
      navigator
        .share({
          text: 'Kuch Bhi',
          title: 'Me hu title',
          url: 'title.com',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else if (eventVal === 'delete') {
      console.log('Deleted');
      // this.deletePost(post);
      this.confirmDelete(post);
    } else {
      console.log('Cancle');
    }
  }

  private async confirmDelete(post: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure!',
      message: 'You want to delete this post.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Delete',
        role: 'confirm',
        handler: () => {
          this.deletePost(post);
        },
      },]
    });
    await alert.present();
  }
  private deletePost(post: any) {
    this.postService.deletePost(post.id);
    this.fireStorage.storage.refFromURL(post.postImage).delete();
  }

  setOpen(isOpen: boolean, postId?: string) {
    this.isModalOpen = isOpen;
    if (isOpen)
      this.getComments(postId);
  }

  public getComments(postId: any) {
    this.postService.getComments(postId).subscribe((res) => {
      this.comments = res.map((e) => {
        let data: any = e.payload.doc.data();
        data = {
          ...data,
          timeAgo: this.timeAgo(new Date(data.commentTime), new Date())
        }
        return data;
      });
    });
  }

  timeAgo(commentTime: any, currentDate: any) {
    const difference = Math.abs(commentTime - currentDate) / 1000; // Difference in seconds
    const secondsPerMinute = 60;
    const secondsPerHour = secondsPerMinute * 60;
    const secondsPerDay = secondsPerHour * 24;
    const secondsPerYear = secondsPerDay * 365;

    const years = Math.floor(difference / secondsPerYear);
    const days = Math.floor((difference % secondsPerYear) / secondsPerDay);
    const hours = Math.floor((difference % secondsPerDay) / secondsPerHour);
    const minutes = Math.floor((difference % secondsPerHour) / secondsPerMinute);
    const seconds = Math.floor(difference % secondsPerMinute);

    if (difference < 1) {
      return 'just now';
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  }
  public sendComment(postId: string) {
    let commentVal: any = {
      userId: this.user.id,
      userName: this.user.name,
      commentMessage: this.comment,
      commentTime: moment().format("MMMM DD, YYYY, h:mm:ss a")
    };
    if (this.user.profilePic) {
      commentVal = {
        ...commentVal,
        profilePic: this.user.profilePic
      };
    }
    if (this.comment) {
      this.postService.addComment(postId, commentVal).then(() => {
        this.comment = '';
      })
        .catch(async (e: any) => {
          const toast = await this.toastController.create({
            message: 'Somthing went wrong!',
            duration: 1500,
            position: 'top',
          });
          await toast.present();
        });
    } else {
      console.log('123 :>> ', 123);
    }
  }
}
