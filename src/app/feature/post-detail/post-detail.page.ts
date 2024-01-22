import { LocalstorageService } from './../../shared/services/localstorage.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { PostUiComponent } from 'src/app/shared/components/post-ui/post-ui.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PostUiComponent],
})
export class PostDetailPage implements OnInit {
  private postService = inject(PostService);
  private localstorageService = inject(LocalstorageService);


  public currentUser:any;
  @Input() private postId!: string;

  public post: any = {};

  ngOnInit() {
    this.currentUser = this.localstorageService.getItem('userDetails');
    this.postService.getPost(this.postId).subscribe((res) => {
      this.post = Object.assign({ id: res.payload.id }, res.payload.data());
    });
  }
}
