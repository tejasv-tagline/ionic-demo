import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  standalone: true,
  styleUrls: ['./post-ui.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PostUiComponent {
  @Input() post: any = {};

  constructor() {}

  public onLike(i: number) {}
}
