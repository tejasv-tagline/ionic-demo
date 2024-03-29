import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class DashboardPage implements OnInit {
  private localStorage = inject(LocalstorageService);
  public user = this.localStorage.getItem('userDetails');

  private localstorageService = inject(LocalstorageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private photoService = inject(PhotoService);
  private postService = inject(PostService);
  private storage = inject(AngularFireStorage);

  @ViewChild(IonModal) modal!: IonModal;
  isToastOpen = false;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  postForm!: FormGroup;
  imageUrl: any;
  uploadFileObj: any;
  downloadURL: any;

  constructor() {
    this.createPostForm();
  }

  ngOnInit() {}

  private createPostForm() {
    this.postForm = this.fb.group({
      postImage: [null, [Validators.required]],
      content: [null],
    });
  }

  opneModel() {
    console.log('123 :>> ', 123);
  }

  //Model
  cancel() {
    console.log('cancel :>> ');
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('confirm :>> ');
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    const userDetails = this.localstorageService.getItem('userDetails');
    if (ev.detail.role === 'confirm') {
      this.uploadPost(this.uploadFileObj, userDetails);
    } else {
      this.clearImageonCancel();
    }
  }

  uploadPost(event: any, userDetails: any) {
    const filePath = `posts/${event.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, event);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((downloadURL) => {
            this.downloadURL = downloadURL;
            let data:any = {
              userId: userDetails.id,
              postImage: downloadURL,
              postTime: new Date(),
              userName: userDetails.name,
              postMessage: this.postForm.value.content,
            };
            if (userDetails.profilePic) {
              data = {
                ...data,
                profile: userDetails.profilePic
              }
            }
            this.postService.addPost(data).then((res: any) => {
              this.isToastOpen = true;
              this.clearImageonCancel();
            });
          });
        })
      )
      .subscribe();
  }

  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.uploadFileObj = file;
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }

  private clearImageonCancel() {
    this.postForm.reset();
    this.uploadFileObj = null;
    this.imageUrl = null;
  }

  // async captureAndUploadPhoto() {
  //   try {
  //     const capturedPhoto = await this.photoService.takePhoto();
  //     const downloadURL = await this.photoService.uploadPhoto(capturedPhoto);

  //     console.log('Photo uploaded. Download URL:', downloadURL);
  //   } catch (error) {
  //     console.error('Error capturing or uploading photo:', error);
  //   }
  // }
  addPhotoToGallery() {
    // this.photoService.addNewToGallery().then((res:any)=>{console.log('res :>> ', res);
    // });
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  navigateProfile() {
    this.router.navigate(['/profile/' + this.user.id]);
  }
}
