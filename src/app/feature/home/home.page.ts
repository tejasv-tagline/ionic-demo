import { IonicModule } from '@ionic/angular';
import { Component, inject } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {
  public presentingElement: any;
  private actionSheetCtrl = inject(ActionSheetController);
  public isLiked: boolean = false;
  public currentLike!: number;
  public posts: any = [
    {
      name: 'Tejas',
      image: 'https://media.istockphoto.com/id/886636648/photo/young-man-is-taking-pictures-with-an-old-camera.jpg?s=612x612&w=0&k=20&c=xhNzBup3llLNBJjj4wU6kO8gmK8xiXIbxKX6cpveUhI='
    },
    {
      name: 'Jaydeep',
      image: 'https://media.istockphoto.com/id/1210526465/photo/young-man-photographer-taking-pictures-in-a-city.jpg?s=170667a&w=0&k=20&c=mPGTrzRd4ANz1AhYX9iV7bRzKyfMlMzkPxClXtOvPnE='
    },
    {
      name: 'Dharmik',
      image: 'https://media.istockphoto.com/id/1463682140/photo/man-takes-a-picture-with-a-camera.jpg?s=170667a&w=0&k=20&c=pvcHpEVCX_8863XyOzCHFQcF6oKzXyvCaRAvyZsKFz8='
    },
    {
      name: 'Arvind Maurya',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/001/271/865/small/view-of-a-male-photographer.jpg'
    }
  ]

  ngOnInit() {
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
    this.currentLike = i;
    this.isLiked = !this.isLiked;
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

  logResult(ev: any) {
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
    } else {
      console.log('Cancle');
    }
  }
}
