import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports:[IonicModule]
})
export class HomePage {
  constructor() {}

  closeMenu() {
    // this.menu.close();
  }
}
