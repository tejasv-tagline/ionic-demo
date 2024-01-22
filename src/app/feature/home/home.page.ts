import { IonicModule } from '@ionic/angular';
import { Component, ViewChild, inject } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { LoaderService } from 'src/app/shared/services/loader.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  

  public presentingElement: any;
  private actionSheetCtrl = inject(ActionSheetController);
  public isLiked: boolean = false;
  public currentLike!: number;
  public posts: any = [];

  constructor(
    private postService:PostService,
    private loaderService:LoaderService
    ){}

  ngOnInit() {
    this.getAllPosts();
    this.presentingElement = document.querySelector('.ion-page');
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  onIonInfinite(ev: any) {
    console.log('ev :>> ', ev);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  handleRefresh(event: any) {
    console.log('event :>> ', event);
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  onLike(i: number) {
    // this.currentLike = i;
    // this.isLiked = !this.isLiked;
    this.posts[i].isLike = !this.posts[i].isLike;
    this.posts = [...this.posts];
  }

  public actionSheetButtons = [
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

  logResult(ev: any,postId:string) {
    const eventVal = ev.detail.data && ev.detail.data.action;
    if(eventVal === 'share'){
      navigator.share({
        text: 'Kuch Bhi',
        title: 'Me hu title',
        url: 'title.com'
      }).then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else if(eventVal === 'delete'){
      console.log('Deleted');
      // const index = this.posts.findIndex((post:any)=> post.id === postId);
      // this.posts.splice(index,1);
      this.deletePost(postId);
    } else {
      console.log('Cancle');
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
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
      ],
    });

    await actionSheet.present();
  }

  //Manage posts section start

  private getAllPosts(): void {
    this.loaderService.showLoading('Posts Loading!');
    this.postService.getPosts().subscribe((data) => {
      this.posts = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      this.loaderService.hideLoading();
    });
  }

  deletePost(postId:string){
    this.postService.deletePost(postId);
  }
  //Manage posts section end

}
