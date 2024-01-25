import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { PostService } from 'src/app/services/post.service';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController } from '@ionic/angular';

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
        //   this.post.actionButtons = this.post?.userId === this.user.id
        //     ? [
        //       {
        //         text: 'Delete',
        //         role: 'destructive',
        //         data: {
        //           action: 'delete',
        //         },
        //       },
        //       ...this.defaultActionSheetButtons,
        //     ]
        //     : this.defaultActionSheetButtons;
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

  private async confirmDelete(post:any){
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
}
