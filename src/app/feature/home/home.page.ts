import { IonicModule } from '@ionic/angular';
import { Component, ViewChild, inject } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { PostUiComponent } from 'src/app/shared/components/post-ui/post-ui.component';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,PostUiComponent]
})
export class HomePage {

  private localstorageService = inject(LocalstorageService);
  

  public presentingElement: any;
  private actionSheetCtrl = inject(ActionSheetController);
  public isLiked: boolean = false;
  public currentLike!: number;
  public posts: any = [];

  constructor(
    private postService:PostService,
    private loaderService:LoaderService,
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

  onLike(i:number,postId:string) {
    this.posts[i].isLike = !this.posts[i].isLike;
    this.posts = [...this.posts];
    const userDetails = this.localstorageService.getItem('userDetails');
    
    const likedDetails = {
      userId:userDetails.id,
      userName: userDetails.name
    };
    this.postService.addLike(postId,likedDetails).then((res:any)=>{
      console.log('res :>> ', res);
    });
  }

  public actionSheetButtons = [
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
      this.deletePost(postId);
    } else {
      console.log('Cancle');
    }
  }

  // private getPostById(postId:string){
  //   this.postService.getPostById(postId).subscribe((post:any)=>{
  //     return post.payload.data();
  //   });
  // }

  // public async presentActionSheet(postId:string) {
  //   console.log('postId :>> ', postId);
  //   const currentPostDetails = await this.getPostById(postId);
  //   console.log('currentPostDetails :>> ', currentPostDetails);
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     buttons: [
  //       {
  //         text: 'Share',
  //         data: {
  //           action: 'share',
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         data: {
  //           action: 'cancel',
  //         },
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  //   await actionSheet.onDidDismiss().then((event:any)=>{
  //     console.log('event :>> ', event);
  //     const eventVal = event.data && event.data.action;
  //     if(eventVal === 'share'){
  //       navigator.share({
  //         text: 'Kuch Bhi',
  //         title: 'Me hu title',
  //         url: 'title.com'
  //       }).then(() => console.log('Successful share'))
  //       .catch((error) => console.log('Error sharing', error));
  //     } else if(eventVal === 'delete'){
  //       console.log('Deleted');
  //       this.deletePost(postId);
  //     } else {
  //       console.log('Cancle');
  //     }
  //   })
  // }

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

  private deletePost(postId:string){
    this.postService.deletePost(postId);
  }

  // private updatePost(postId:string){
  //   this.postService.updatePost(postId,).then((update:any)=>{
  //     console.log('update :>> ', update);
  //   })
  // }
  //Manage posts section end

}
