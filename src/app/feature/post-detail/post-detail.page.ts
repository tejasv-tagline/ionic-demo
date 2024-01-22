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

  @Input() private postId!: string;

  public post: any = {};

  ngOnInit() {
    this.postService.getPost(this.postId).subscribe((res) => {
      console.log('res.payload.data() :>> ', res.payload.data());
      this.post = res.payload.data();
      console.log('this.post :>> ', this.post);
    });
  }
}
