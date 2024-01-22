import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatDetailsPage implements OnInit {

  public users: any = [
    {
      id:1,
      name: 'Tejas',
      image: 'https://media.istockphoto.com/id/886636648/photo/young-man-is-taking-pictures-with-an-old-camera.jpg?s=612x612&w=0&k=20&c=xhNzBup3llLNBJjj4wU6kO8gmK8xiXIbxKX6cpveUhI='
    },
    {
      id:2,
      name: 'Jaydeep',
      image: 'https://media.istockphoto.com/id/1210526465/photo/young-man-photographer-taking-pictures-in-a-city.jpg?s=170667a&w=0&k=20&c=mPGTrzRd4ANz1AhYX9iV7bRzKyfMlMzkPxClXtOvPnE='
    },
    {
      id:3,
      name: 'Dharmik',
      image: 'https://media.istockphoto.com/id/1463682140/photo/man-takes-a-picture-with-a-camera.jpg?s=170667a&w=0&k=20&c=pvcHpEVCX_8863XyOzCHFQcF6oKzXyvCaRAvyZsKFz8='
    },
    {
      id:4,
      name: 'Arvind Maurya',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/001/271/865/small/view-of-a-male-photographer.jpg'
    }
  ];
  public currentUser:any;
  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((res:any)=>{
      this.currentUser = this.users.find((user:any)=> user.id === Number(res.id));
    });
  }

}
