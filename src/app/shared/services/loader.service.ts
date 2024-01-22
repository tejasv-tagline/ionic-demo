import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private loadingCtrl: LoadingController) { }


  async showLoading(message:string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    loading.present();
  }

  hideLoading(){
    this.loadingCtrl.dismiss();
  }
}
