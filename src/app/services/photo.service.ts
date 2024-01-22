import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: any[] = [];
  constructor(private storage: AngularFireStorage) {}

  async takePhoto(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });

    return capturedPhoto;
  }

  async uploadPhoto(photo: any): Promise<string> {
    const storageRef = this.storage.ref(`photos/${new Date().getTime()}.jpg`);

    const uploadTask = storageRef.putString(photo.dataUrl, 'data_url');

    return new Promise((resolve, reject) => {
      uploadTask.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL);
        });
      }).catch((error) => {
        console.error('Error uploading photo:', error);
        reject(error);
      });
    });
  }

  // public async addNewToGallery() {
  //   // Take a photo
  //   const capturedPhoto = await Camera.getPhoto({
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Camera,
  //     quality: 100
  //   });
  //   const savedImageFile = await this.savePicture(capturedPhoto);
  //   this.photos.unshift(savedImageFile);
  // }

  // // public async getPhotoFromGallery(){
  // //    const list = Camera.getLimitedLibraryPhotos();
  // // }

  // private async savePicture(photo: Photo) {
  //   // Convert photo to base64 format, required by Filesystem API to save
  //   const base64Data = await this.readAsBase64(photo);
  
  //   // Write the file to the data directory
  //   const fileName = Date.now() + '.jpeg';
  //   const savedFile = await Filesystem.writeFile({
  //     path: fileName,
  //     data: base64Data,
  //     directory: Directory.Data
  //   });
  
  //   // Use webPath to display the new image instead of base64 since it's
  //   // already loaded into memory
  //   return {
  //     filepath: fileName,
  //     webviewPath: photo.webPath
  //   };
  // }

  // private async readAsBase64(photo: Photo) {
  //   // Fetch the photo, read as a blob, then convert to base64 format
  //   const response = await fetch(photo.webPath!);
  //   const blob = await response.blob();
  
  //   return await this.convertBlobToBase64(blob) as string;
  // }
  
  // private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onerror = reject;
  //   reader.onload = () => {
  //       resolve(reader.result);
  //   };
  //   reader.readAsDataURL(blob);
  // });
}
