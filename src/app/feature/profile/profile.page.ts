import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

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
  private storage = inject(AngularFireStorage);



  // @Input() private userId!: string;
  private userId:any;
  public user: any;
  public posts: any;
  public isLoader:boolean = false;
  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      text: 'Logout',
      role: 'destructive',
      data: {
        action: 'logout',
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

  constructor() {}

  ngOnInit() {
    this.userId = this.localstorageService.getItem('userDetails').id;
    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe((res) => {
        this.user = res.payload.data();
      });

      this.postService.getPostByUserId(this.userId).subscribe((res) => {
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

  uploadProfile(event: any) {
    const filePath = `usersProfile/${event.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, event);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((downloadURL) => {
            this.user.profilePic = downloadURL;
            const data = {
              ...this.user
            };
            this.userService.updateUser(this.userId,data).then((res: any) => {
              this.isLoader = false;
            });
          });
        })
      )
      .subscribe();
  }
  
  onSelectFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      // var reader = new FileReader();
      this.isLoader = true;
      // reader.readAsDataURL(event.target.files[0]); // read file as data url
      if(this.user.profilePic){
        this.storage.storage.refFromURL(this.user.profilePic).delete();
      }
      this.uploadProfile(event.target.files[0]);
    }
  }

  logResult(ev:any) {
    const eventVal = ev.detail.data && ev.detail.data.action;
    if(eventVal === 'logout') {
      this.localstorageService.clearLocalStorage();
      this.router.navigate(['/login']);
    }
  }
}
